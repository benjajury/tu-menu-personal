-- Create user preferences table for quiz responses
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  meat_preference TEXT,
  dietary_restriction TEXT,
  drink_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user preferences (public access since we're not using auth for quiz)
CREATE POLICY "Anyone can insert preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their session preferences" 
ON public.user_preferences 
FOR SELECT 
USING (true);

-- Create index for performance
CREATE INDEX idx_user_preferences_session_id ON public.user_preferences(session_id);
CREATE INDEX idx_user_preferences_created_at ON public.user_preferences(created_at);