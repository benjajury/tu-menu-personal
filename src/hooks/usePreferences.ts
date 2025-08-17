import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  meatPreference?: string;
  dietaryRestriction?: string;
  drinkPreference?: string;
}

export function usePreferences() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [loading, setLoading] = useState(false);

  const savePreferences = async (prefs: Record<string, string>) => {
    setLoading(true);
    console.log('🔍 Saving preferences:', prefs);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          session_id: sessionId,
          meat_preference: prefs['meat-preference'],
          dietary_restriction: prefs['dietary-restriction'],
          drink_preference: prefs['drink-preference']
        });

      if (error) throw error;

      const savedPrefs = {
        meatPreference: prefs['meat-preference'],
        dietaryRestriction: prefs['dietary-restriction'],
        drinkPreference: prefs['drink-preference']
      };
      
      console.log('✅ Preferences saved successfully:', savedPrefs);
      setPreferences(savedPrefs);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    sessionId,
    preferences,
    savePreferences,
    loading
  };
}