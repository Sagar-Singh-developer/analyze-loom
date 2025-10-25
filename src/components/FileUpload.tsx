import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  onUploadComplete: (uploadId: string, columns: string[], data: any[]) => void;
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

          if (jsonData.length === 0) {
            throw new Error('Empty spreadsheet');
          }

          const columns = jsonData[0] as string[];
          const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));

          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          // Create upload record
          const { data: upload, error: uploadError } = await supabase
            .from('uploads')
            .insert({
              user_id: user.id,
              filename: file.name,
              file_size: file.size,
              columns,
              row_count: rows.length,
            })
            .select()
            .single();

          if (uploadError) throw uploadError;

          // Store data rows
          const dataRows = rows.map(row => {
            const obj: any = {};
            columns.forEach((col, idx) => {
              obj[col] = row[idx] ?? null;
            });
            return { upload_id: upload.id, row_data: obj };
          });

          const { error: dataError } = await supabase
            .from('upload_data')
            .insert(dataRows);

          if (dataError) throw dataError;

          toast({
            title: 'Success',
            description: `Uploaded ${file.name} with ${rows.length} rows`,
          });

          onUploadComplete(upload.id, columns, rows.map(row => {
            const obj: any = {};
            columns.forEach((col, idx) => {
              obj[col] = row[idx] ?? null;
            });
            return obj;
          }));

        } catch (error: any) {
          toast({
            title: 'Error',
            description: error.message || 'Failed to parse Excel file',
            variant: 'destructive',
          });
        } finally {
          setUploading(false);
        }
      };

      reader.readAsBinaryString(file);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
      setUploading(false);
    }
  }, [toast, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <Card
      {...getRootProps()}
      className={`cursor-pointer border-2 border-dashed p-12 text-center transition-all ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ scale: isDragActive ? 1.05 : 1 }}
        className="flex flex-col items-center gap-4"
      >
        {uploading ? (
          <>
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-lg font-medium">Processing...</p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-primary/10 p-6">
              {isDragActive ? (
                <FileSpreadsheet className="h-12 w-12 text-primary" />
              ) : (
                <Upload className="h-12 w-12 text-primary" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your file here' : 'Drag & drop Excel file'}
              </p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <Button type="button" variant="outline">
              Select File
            </Button>
            <p className="text-xs text-muted-foreground">
              Supports .xlsx and .xls files
            </p>
          </>
        )}
      </motion.div>
    </Card>
  );
};
