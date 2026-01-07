import React from 'react';

interface ReplaceBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookTitle: string;
}

const ReplaceBookModal: React.FC<ReplaceBookModalProps> = ({ isOpen, onClose, onConfirm, bookTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in fade-in zoom-in duration-200">
        
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
           <span className="material-symbols-outlined text-2xl">swap_horiz</span>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Replace Book?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to stop tracking <br/>
            <span className="font-bold text-slate-800 dark:text-slate-200">"{bookTitle}"</span>?
          </p>
          <p className="text-xs text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            This will remove it from "Currently Reading" so you can pick a new book.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Replace</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplaceBookModal;
