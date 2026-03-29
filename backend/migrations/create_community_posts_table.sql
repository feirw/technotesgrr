-- Migration: Community forum posts table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS community_posts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created_at
    ON community_posts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id
    ON community_posts (user_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all posts.
CREATE POLICY "Authenticated users can read community posts"
    ON community_posts
    FOR SELECT
    TO authenticated
    USING (true);

-- Users can only create posts as themselves.
CREATE POLICY "Users can insert own community posts"
    ON community_posts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

