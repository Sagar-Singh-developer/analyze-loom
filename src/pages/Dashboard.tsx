import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { FileUpload } from '@/components/FileUpload';
import { ChartVisualizer } from '@/components/ChartVisualizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const [currentUpload, setCurrentUpload] = useState<{ id: string; columns: string[]; data: any[] } | null>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);

  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    const { data } = await supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setUploadHistory(data);
    }
  };

  const handleUploadComplete = (uploadId: string, columns: string[], data: any[]) => {
    setCurrentUpload({ id: uploadId, columns, data });
    loadUploadHistory();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Upload and visualize your Excel data</p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="upload">
                <FileText className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="visualize" disabled={!currentUpload}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Visualize
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <FileUpload onUploadComplete={handleUploadComplete} />

              {currentUpload && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {currentUpload.columns.map(col => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentUpload.data.slice(0, 10).map((row, idx) => (
                            <TableRow key={idx}>
                              {currentUpload.columns.map(col => (
                                <TableCell key={col}>{String(row[col] ?? 'N/A')}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {currentUpload.data.length > 10 && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        Showing 10 of {currentUpload.data.length} rows
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="visualize">
              {currentUpload && (
                <ChartVisualizer
                  columns={currentUpload.columns}
                  data={currentUpload.data}
                />
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Upload History</CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No uploads yet</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Filename</TableHead>
                          <TableHead>Rows</TableHead>
                          <TableHead>Columns</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadHistory.map((upload) => (
                          <TableRow key={upload.id}>
                            <TableCell className="font-medium">{upload.filename}</TableCell>
                            <TableCell>{upload.row_count}</TableCell>
                            <TableCell>{upload.columns.length}</TableCell>
                            <TableCell>
                              {new Date(upload.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
