-- Create storage bucket for hike screenshots
insert into storage.buckets (id, name, public) values ('hike-screenshots', 'hike-screenshots', true);

-- Create storage policies for hike screenshots
CREATE POLICY "Anyone can view hike screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hike-screenshots');

CREATE POLICY "Anyone can upload hike screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hike-screenshots');

CREATE POLICY "Anyone can update hike screenshots" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hike-screenshots');

CREATE POLICY "Anyone can delete hike screenshots" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hike-screenshots');