-- Ponytail: production schema. Next.js app uses localStorage store for instant demo/test-driven feedback without credentials. Upgrading to Supabase needs tables below:

CREATE TYPE merchant_status AS ENUM ('active', 'suspended');
CREATE TYPE ticket_status AS ENUM ('waiting', 'serving', 'done');

CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(100) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  status merchant_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  number INT NOT NULL,
  status ticket_status DEFAULT 'waiting',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
