import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: {
    full_name: string;
    username: string;
    bio: string;
    avatar_url: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-slate-900 dark:text-white";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Display Name</label>
              <input 
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                className={inputClass}
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className={labelClass}>Username</label>
              <input 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className={inputClass}
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea 
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className={`${inputClass} min-h-[100px] resize-none`}
              placeholder="Tell us about your reading journey..."
            />
          </div>

          <div>
            <label className={labelClass}>Avatar URL</label>
            <input 
              value={formData.avatar_url}
              onChange={e => setFormData({...formData, avatar_url: e.target.value})}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/25 disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
