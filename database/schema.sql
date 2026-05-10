CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[],
  experience_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidates (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  position TEXT,
  cv_file_url TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidate_analysis (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
  extracted_skills TEXT[],
  experience_level TEXT,
  education_summary TEXT,
  cv_summary TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  ats_score INTEGER,
  match_score INTEGER,
  recommendation TEXT,
  suggested_email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidate_logs (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
  action TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_position ON candidates(position);
CREATE INDEX idx_candidate_analysis_candidate_id ON candidate_analysis(candidate_id);
CREATE INDEX idx_candidate_logs_candidate_id ON candidate_logs(candidate_id);

INSERT INTO jobs (title, description, required_skills, experience_level)
VALUES
  (
    'Frontend Developer',
    'Build accessible React and Next.js interfaces for a hiring automation product. Strong TypeScript, API integration, Tailwind CSS, component architecture, and testing experience required.',
    ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    'Mid-level'
  ),
  (
    'Backend Engineer',
    'Own API design, PostgreSQL modeling, queue-based automation, Supabase integration, and secure workflow services for an AI recruiting platform.',
    ARRAY['Node.js', 'PostgreSQL', 'Supabase', 'APIs', 'Docker'],
    'Mid-level'
  ),
  (
    'AI Automation Specialist',
    'Design n8n workflows, prompt chains, OpenAI automations, document parsing, reporting, and email notification flows for recruiting operations.',
    ARRAY['n8n', 'OpenAI', 'Prompt Engineering', 'Automation', 'Email'],
    'Junior to Mid-level'
  );
