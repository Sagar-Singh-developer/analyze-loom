-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create uploads table for Excel file metadata
CREATE TABLE IF NOT EXISTS public.uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER,
  columns TEXT[] NOT NULL,
  row_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on uploads
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Uploads policies
CREATE POLICY "Users can view own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own uploads"
  ON public.uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads"
  ON public.uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Create upload_data table for storing parsed Excel data
CREATE TABLE IF NOT EXISTS public.upload_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  row_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on upload_data
ALTER TABLE public.upload_data ENABLE ROW LEVEL SECURITY;

-- Upload_data policies
CREATE POLICY "Users can view own upload data"
  ON public.upload_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.uploads
      WHERE uploads.id = upload_data.upload_id
      AND uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own upload data"
  ON public.upload_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.uploads
      WHERE uploads.id = upload_data.upload_id
      AND uploads.user_id = auth.uid()
    )
  );

-- Create storage bucket for Excel files
INSERT INTO storage.buckets (id, name, public)
VALUES ('excel-files', 'excel-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for excel-files bucket
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'excel-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'excel-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'excel-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();