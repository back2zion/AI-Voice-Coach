-- AI Voice Coach Database Schema
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    credits INTEGER DEFAULT 50000,
    subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Discussion Rooms table
CREATE TABLE IF NOT EXISTS discussion_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coaching_option VARCHAR(255) NOT NULL,
    topic TEXT NOT NULL,
    expert_name VARCHAR(255) NOT NULL,
    conversation JSONB,
    summary JSONB,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Conversations table (for chat history)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES discussion_rooms(id) ON DELETE CASCADE NOT NULL,
    user_message TEXT,
    ai_message TEXT,
    message_type VARCHAR(50) DEFAULT 'chat', -- 'chat', 'feedback', 'note'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Feedbacks table (for storing AI feedbacks and notes)
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES discussion_rooms(id) ON DELETE CASCADE NOT NULL,
    feedback_type VARCHAR(50) DEFAULT 'feedback', -- 'feedback', 'notes', 'summary'
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_discussion_rooms_user_id ON discussion_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_discussion_rooms_created_at ON discussion_rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_room_id ON conversations(room_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_room_id ON feedbacks(room_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for discussion_rooms table
CREATE POLICY "Users can view own rooms" ON discussion_rooms FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own rooms" ON discussion_rooms FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own rooms" ON discussion_rooms FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own rooms" ON discussion_rooms FOR DELETE USING (auth.uid()::text = user_id::text);

-- Policies for conversations table
CREATE POLICY "Users can view own conversations" ON conversations 
FOR SELECT USING (
    auth.uid()::text = (SELECT user_id::text FROM discussion_rooms WHERE id = room_id)
);
CREATE POLICY "Users can insert own conversations" ON conversations 
FOR INSERT WITH CHECK (
    auth.uid()::text = (SELECT user_id::text FROM discussion_rooms WHERE id = room_id)
);

-- Policies for feedbacks table
CREATE POLICY "Users can view own feedbacks" ON feedbacks 
FOR SELECT USING (
    auth.uid()::text = (SELECT user_id::text FROM discussion_rooms WHERE id = room_id)
);
CREATE POLICY "Users can insert own feedbacks" ON feedbacks 
FOR INSERT WITH CHECK (
    auth.uid()::text = (SELECT user_id::text FROM discussion_rooms WHERE id = room_id)
);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_rooms_updated_at BEFORE UPDATE ON discussion_rooms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();