import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateListModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('lists')
      .insert([{ 
        title, 
        user_id: user?.id, 
        tag: tag.startsWith('#') ? tag : `#${tag || 'general'}`, 
        is_public: isPublic 
      }]);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Collection created successfully");
      setTitle("");
      setTag("");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        
        {/* Header with Watermark */}
        <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
          <span className="material-symbols-outlined absolute right-[-10px] top-[-10px] text-[80px] text-primary/5 rotate-12 pointer-events-none">
            playlist_add
          </span>
          <h2 className="relative z-10 text-2xl font-black tracking-tighter">New Collection</h2>
          <p className="relative z-10 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Curate your reading journey</p>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-5">
          {/* List Title */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">List Name</Label>
            <Input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Classics"
              className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-bold"
            />
          </div>

          {/* Tag */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tag / Category</Label>
            <Input 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="#philosophy"
              className="h-11 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl font-bold"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${isPublic ? 'text-primary' : 'text-slate-400'}`}>
                {isPublic ? 'public' : 'lock'}
              </span>
              <div>
                <p className="text-xs font-black tracking-tight">{isPublic ? 'Public List' : 'Private List'}</p>
                <p className="text-[10px] text-slate-500 font-medium">Visible to {isPublic ? 'everyone' : 'only you'}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-11 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !title.trim()}
              className="group/btn flex-[2] h-11 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              <span className="relative z-10">{loading ? 'Creating...' : 'Create List'}</span>
              <div className="relative flex items-center overflow-hidden w-4 h-4 ml-2">
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-[-20px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
                  check_circle
                </span>
                <span className="material-symbols-outlined text-[18px] absolute transition-all duration-300 translate-x-0 opacity-100 group-hover/btn:translate-x-[20px] group-hover/btn:opacity-0">
                  add
                </span>
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;
