-- Create tables for Movie Night Organizer

-- Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hash_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    tmdb_id TEXT NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    suggested_by TEXT NOT NULL,
    is_watched BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Votes table
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
    voter_id TEXT NOT NULL, -- Username or unique ID
    value INT NOT NULL CHECK (value IN (-1, 1, 0)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(suggestion_id, voter_id)
);

-- RLS Policies (Simplified for this use case, assuming public/anon access for now as per requirements)
-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow public access (Note: In a real prod app we'd have stricter policies)
CREATE POLICY "Enable all access for rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for suggestions" ON public.suggestions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for votes" ON public.votes FOR ALL USING (true) WITH CHECK (true);
