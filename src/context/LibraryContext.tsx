import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface LibraryContextType {
  library: any[];
  userProfile: { name: string; username: string; avatar_url: string };
  loading: boolean; // The value
  counts: { all: number; read: number; currentlyReading: number };
  refresh: () => Promise<void>; // The function that handles loading internally
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({ name: "Reader", username: "user", avatar_url: "" });
  
  // THIS LINE MUST BE HERE
  const [loading, setLoading] = useState(true); 

  const refresh = async () => {
    try {
      setLoading(true); // Now defined inside this scope
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserProfile({
        name: user.user_metadata?.full_name || "Reader",
        username: user.email?.split('@')[0] || "user",
        avatar_url: user.user_metadata?.avatar_url || ""
      });

      const { data, error } = await supabase
        .from('user_books')
        .select(`*, books:book_id (*)`)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLibrary(data || []);
    } catch (err) {
      console.error("Context Refresh Error:", err);
    } finally {
      setLoading(false); // Now defined inside this scope
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const counts = useMemo(() => ({
    all: library.length,
    read: library.filter(b => b.status === 'finished').length,
    currentlyReading: library.filter(b => b.status === 'reading').length
  }), [library]);

  return (
    <LibraryContext.Provider value={{ library, userProfile, loading, counts, refresh }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
