import React, { useState } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';
import { Deck } from '../types/flashcard';
import { sounds } from '../utils/audio';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (deck: Deck) => void;
}

export const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
  isOpen,
  onClose,
  onCreateDeck,
}) => {
  const [title, setTitle] = useState('');
  const [titleThai, setTitleThai] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<Deck['color']>('blue');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playStamp();
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: title.trim(),
      titleThai: titleThai.trim() || undefined,
      description: description.trim() || 'Custom ring flashcard deck',
      color,
      createdAt: Date.now(),
      cards: [],
    };

    onCreateDeck(newDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1d1c16]/30 backdrop-blur-xs">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-2xl border-[1.5px] border-[#EAE5DC] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5DC] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAE5DC] border border-[#d6c1c7] flex items-center justify-center text-[#484A50]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1d1c16]">New Flashcard Deck</h2>
              <p className="text-[11px] text-[#74777c]">Create a new ring-bound collection</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playRingClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-[#EAE5DC] text-[#74777c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-1">
              Deck Name (English) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Airport & Flight Phrases"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-1">
              Deck Name (Thai)
            </label>
            <input
              type="text"
              placeholder="e.g. วลีสำคัญในสนามบินและการเดินทาง"
              value={titleThai}
              onChange={(e) => setTitleThai(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['IBM_Plex_Sans_Thai',sans-serif]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Short study note or goal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
            />
          </div>

          {/* Color tag */}
          <div>
            <label className="block text-xs font-semibold text-[#484A50] mb-2">
              Stationery Color Theme
            </label>
            <div className="flex items-center gap-2.5">
              {[
                { id: 'blue', label: 'Powder Blue', bg: 'bg-[#DCEBFA]' },
                { id: 'pink', label: 'Blush Pink', bg: 'bg-[#F5DFE5]' },
                { id: 'sand', label: 'Warm Oatmeal', bg: 'bg-[#ede8df]' },
                { id: 'lavender', label: 'Muted Lavender', bg: 'bg-[#e6ebfa]' },
                { id: 'sage', label: 'Soft Sage', bg: 'bg-[#e1ece3]' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id as any)}
                  className={`w-7 h-7 rounded-full ${c.bg} border-2 transition-transform ${
                    color === c.id
                      ? 'border-[#484A50] scale-110 shadow-xs'
                      : 'border-transparent hover:scale-105'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] text-xs font-semibold text-[#484A50]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] border border-[#A8BDD2] text-xs font-bold text-[#1d1c16] shadow-2xs active:translate-y-[1px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Binder Deck</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
