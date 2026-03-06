-- Migration: Create career_orientation_results table
-- This table stores career orientation (prosanatolismos) questionnaire results
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS career_orientation_results (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- Stores question_id -> score (1-5) mapping
    final_scores JSONB NOT NULL, -- Stores calculated scores per category
    top_category VARCHAR(20) NOT NULL, -- The top scoring category (INFO, FIN, etc.)
    sorted_scores JSONB NOT NULL, -- Array of {category, score} sorted by score
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one result per user (latest result overwrites previous)
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_career_orientation_user_id ON career_orientation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_career_orientation_completed_at ON career_orientation_results(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE career_orientation_results ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own results
CREATE POLICY "Users can view own career orientation results"
    ON career_orientation_results
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own results
CREATE POLICY "Users can insert own career orientation results"
    ON career_orientation_results
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own results
CREATE POLICY "Users can update own career orientation results"
    ON career_orientation_results
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE career_orientation_results IS 'Stores career orientation questionnaire results for each user';
COMMENT ON COLUMN career_orientation_results.answers IS 'JSON object mapping question IDs (as strings) to scores (1-5)';
COMMENT ON COLUMN career_orientation_results.final_scores IS 'JSON object with category scores: {INFO: number, FIN: number, ...}';
COMMENT ON COLUMN career_orientation_results.sorted_scores IS 'JSON array of {category: string, score: number} sorted by score descending';
