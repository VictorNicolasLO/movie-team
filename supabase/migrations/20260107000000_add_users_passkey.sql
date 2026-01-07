-- Create room_users table
CREATE TABLE IF NOT EXISTS public.room_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    passkey TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(room_id, username)
);

-- Enable RLS
ALTER TABLE public.room_users ENABLE ROW LEVEL SECURITY;

-- Allow public access (consistent with existing loose security as per initial_schema.sql)
CREATE POLICY "Enable all access for room_users" ON public.room_users FOR ALL USING (true) WITH CHECK (true);
