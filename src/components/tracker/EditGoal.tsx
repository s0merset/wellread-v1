import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentTarget: number;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onSuccess, currentTarget }) => {
  const [target, setTarget] = useState(currentTarget);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentYear = new Date().getFullYear();

      // Upsert: Update if exists, Insert if not
      const { error } = await supabase
        .from('reading_challenges')
        .upsert({ 
          user_id: user.id, 
          year: currentYear, 
          target_books: target 
        }, { onConflict: 'user_id, year' });

      if (error) throw error;

      toast.success("Reading goal updated!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reading Goal</h3>
        <p className="text-sm text-slate-500 mb-6">How many books do you want to read this year?</p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button onClick={() => setTarget(Math.max(1, target - 1))} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined">remove</span>
          </button>
          <div className="text-4xl font-extrabold text-primary">{target}</div>
          <button onClick={() => setTarget(target + 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 shadow-lg shadow-primary/25 disabled:opacity-70">
            {loading ? 'Saving...' : 'Set Goal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;
