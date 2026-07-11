'use client';
import { createClient } from '../../lib/supabase';
import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    console.log("Testing Supabase connection...");
    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Supabase Error:", error);
      } else {
        console.log("Supabase connection success:", data);
      }
    });
  }, []);

  return <div>Check the Console (F12) for connection results.</div>;
}