import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

interface UpdateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  list: {
    id: string;
    title: string;
    tag: string;
    is_public: boolean;
  } | null;
}

const UpdateListModal: React.FC<UpdateListModalProps> = ({ isOpen, onClose, onSuccess, list }) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state with the selected list when the modal opens
  useEffect(() => {
    if (list) {
      setTitle(list.title);
      setTag(list.tag || "");
      setIsPublic(list.is_public);
    }
  }, [list, isOpen]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("List title is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('lists')
        .update({
          title: title.trim(),
          tag: tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`,
          is_public: isPublic,
          updated_at: new Date().toISOString(),
        })
        .eq('id', list?.id);

      if (error) throw error;

      toast.success("List updated successfully");
      onSuccess(); // Refresh the list on the parent page
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update list");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined font-fill">edit_note</span>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">Edit List</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Update your collection details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">List Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
              placeholder="e.g. My Winter Classics"
              autoFocus
            />
          </div>

          {/* Tag Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Category Tag</label>
            <div className="relative">
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="#fiction"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">sell</span>
            </div>
          </div>

          {/* Privacy Toggle */}
          <div 
            onClick={() => setIsPublic(!isPublic)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
              isPublic 
              ? 'border-emerald-500/50 bg-emerald-500/5' 
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-[24px] ${isPublic ? 'text-emerald-500 font-fill' : 'text-slate-400'}`}>
                {isPublic ? 'public' : 'lock'}
              </span>
              <div>
                <p className={`text-xs font-black uppercase tracking-widest ${isPublic ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-300'}`}>
                  {isPublic ? 'Public List' : 'Private List'}
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  {isPublic ? 'Visible to everyone' : 'Only you can see this'}
                </p>
              </div>
            </div>
            <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
              isPublic ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-600'
            }`}>
              {isPublic && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-12 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateListModal;
