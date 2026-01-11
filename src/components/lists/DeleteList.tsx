import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

interface DeleteListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  list: { id: string; title: string } | null;
}

const DeleteListModal: React.FC<DeleteListModalProps> = ({ isOpen, onClose, onSuccess, list }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!list) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('lists')
        .delete()
        .eq('id', list.id);

      if (error) throw error;

      toast.success("List deleted successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete list");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !list) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">delete_forever</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Delete List?</h2>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-slate-200">"{list.title}"</span>? 
            This action cannot be undone.
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-12 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Delete Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteListModal;
