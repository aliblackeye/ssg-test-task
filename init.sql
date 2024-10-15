-- init.sql
-- Bu dosya, PostgreSQL konteyneri ilk oluşturulduğunda otomatik olarak çalıştırılacaktır.
-- Kullanıcılar tablosunu oluştur
CREATE TABLE IF NOT EXISTS user(
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Örnek kullanıcı verisi ekleyin
INSERT INTO
  user(fullname, email, password)
VALUES
  ('john_doe', 'john@example.com', 'password123'),
  ('jane_smith', 'jane@example.com', 'password456')
ON CONFLICT (email) DO NOTHING;

-- Görevler tablosunu oluştur
CREATE TABLE IF NOT EXISTS task (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Örnek görev verisi ekleyin
INSERT INTO
  task (user_id, description)
VALUES
  (1, 'This is the description of the first task.'),
  (
    2,
    'Hello, this is my first task on the platform!'
  )
ON CONFLICT DO NOTHING;
