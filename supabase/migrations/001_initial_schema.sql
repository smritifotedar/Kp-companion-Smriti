-- Kashmiri Pandit Digital Companion — Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER PROFILES
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- FAMILY HERITAGE RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS family_heritage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  family_name TEXT,
  gotra TEXT,
  kuldevta TEXT,
  native_village TEXT,
  native_tehsil TEXT,
  native_district TEXT,
  family_traditions TEXT,
  annual_observances TEXT,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE family_heritage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own heritage" ON family_heritage
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FESTIVAL CALENDAR
-- =====================================================
CREATE TABLE IF NOT EXISTS festivals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kashmiri_name TEXT,
  description TEXT,
  tithi TEXT,
  paksha TEXT CHECK (paksha IN ('shukla', 'krishna')),
  tithi_number INTEGER,
  kp_month INTEGER,
  significance TEXT,
  rituals JSONB DEFAULT '[]',
  foods JSONB DEFAULT '[]',
  category TEXT CHECK (category IN ('major', 'regional', 'monthly')),
  unique_to_kp BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RITUALS LIBRARY
-- =====================================================
CREATE TABLE IF NOT EXISTS rituals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kashmiri_name TEXT,
  category TEXT,
  description TEXT,
  purpose TEXT,
  historical_background TEXT,
  religious_significance TEXT,
  materials JSONB DEFAULT '[]',
  steps JSONB DEFAULT '[]',
  regional_variations TEXT,
  common_misconceptions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- KNOWLEDGE ARCHIVE ARTICLES
-- =====================================================
CREATE TABLE IF NOT EXISTS archive_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  tags JSONB DEFAULT '[]',
  author TEXT,
  scholar_reviewed BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE archive_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published articles" ON archive_articles
  FOR SELECT USING (published = TRUE);

-- =====================================================
-- JANMA TITHI RECORDS
-- =====================================================
CREATE TABLE IF NOT EXISTS janma_tithi_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  tithi TEXT,
  paksha TEXT,
  nakshatra TEXT,
  rashi TEXT,
  kp_month TEXT,
  samvat_year INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE janma_tithi_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own janma tithi records" ON janma_tithi_records
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- COMMUNITY CONTRIBUTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS community_contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT,
  contribution_type TEXT CHECK (contribution_type IN ('article', 'oral_history', 'photo', 'ritual', 'tradition')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_heritage_updated_at BEFORE UPDATE ON family_heritage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED FESTIVALS DATA
-- =====================================================
INSERT INTO festivals (id, name, kashmiri_name, description, tithi, paksha, tithi_number, kp_month, category, unique_to_kp) VALUES
('navreh', 'Navreh', 'नवरेह', 'Kashmiri Pandit New Year per Sapta Rishi Samvat — Pratipada of Shukla Paksha, Chaitra.', 'Pratipada of Shukla Paksha, Chaitra', 'shukla', 1, 1, 'major', TRUE),
('herath', 'Herath', 'हेरथ', 'Kashmiri Pandit Shivaratri — Chaturdashi of Krishna Paksha, Phalguna.', 'Chaturdashi of Krishna Paksha, Phalguna', 'krishna', 14, 12, 'major', TRUE),
('zyeth-atham', 'Zyeth Atham', 'ज्येठ अठम', 'Ashtami of Shukla Paksha, Jyeshtha — worship of Sharika Devi.', 'Ashtami of Shukla Paksha, Jyeshtha', 'shukla', 8, 3, 'major', TRUE),
('khetsrimavas', 'Khetsrimavas', 'खेत खिचड़ी', 'Harvest festival on Amavasya of Pausha (Poh) — unique to KP community.', 'Amavasya, Pausha', 'krishna', 30, 10, 'major', TRUE)
ON CONFLICT (id) DO NOTHING;
