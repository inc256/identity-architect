CREATE SEQUENCE public.cytic_quote_number_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  business_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  preferred_contact text NOT NULL,
  business_stage text NOT NULL,
  industry text NOT NULL,
  current_website text,
  online_presence text,
  project_description text NOT NULL,
  selected_services jsonb NOT NULL DEFAULT '[]'::jsonb,
  brand_scope text NOT NULL,
  digital_requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline text NOT NULL,
  estimated_price bigint NOT NULL CHECK (estimated_price >= 0),
  estimated_weeks_min integer NOT NULL CHECK (estimated_weeks_min > 0),
  estimated_weeks_max integer NOT NULL CHECK (estimated_weeks_max >= estimated_weeks_min),
  pricing_version text NOT NULL,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Contacted', 'Proposal Sent', 'Approved', 'In Progress', 'Completed', 'Declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.quote_requests TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.cytic_quote_number_seq TO service_role;

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.assign_cytic_quote_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.quote_id IS NULL OR NEW.quote_id = '' THEN
    NEW.quote_id := 'CYTIC-Q-' || to_char(CURRENT_DATE, 'YYYY') || '-' || lpad(nextval('public.cytic_quote_number_seq')::text, 3, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_cytic_quote_id
BEFORE INSERT ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION public.assign_cytic_quote_id();

CREATE OR REPLACE FUNCTION public.touch_cytic_quote_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER touch_cytic_quote_updated_at
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW EXECUTE FUNCTION public.touch_cytic_quote_updated_at();

CREATE INDEX quote_requests_created_at_idx ON public.quote_requests (created_at DESC);
CREATE INDEX quote_requests_status_idx ON public.quote_requests (status);
CREATE INDEX quote_requests_email_idx ON public.quote_requests (email);