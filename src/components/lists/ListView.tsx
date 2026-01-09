import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const ListViewModal = ({ isOpen, onClose, listId, listTitle, onRefresh }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && listId) fetchItems();
  }, [isOpen, listId]);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('list_items')
      .select(`id, books (id, title, author, cover_url)`)
      .eq('list_id', listId);
    setItems(data || []);
    setLoading(false);
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase.from('list_items').delete().eq('id', itemId);
    if (!error) {
      toast.success("Book removed");
      fetchItems();
      onRefresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">{listTitle}</h2>
          <button onClick={onClose} className="material-symbols-outlined">close</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? <p>Loading...</p> : items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
              <img src={item.books.cover_url} className="w-12 h-16 object-cover rounded shadow" />
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.books.title}</h4>
                <p className="text-xs text-slate-500">{item.books.author}</p>
              </div>
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
          {!loading && items.length === 0 && <p className="text-center text-slate-500 italic">No books in this list yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ListViewModal;
