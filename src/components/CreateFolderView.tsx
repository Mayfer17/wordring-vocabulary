import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Coffee,
  Plane,
  Briefcase,
  Target,
  Folder as FolderIcon,
  Check,
} from 'lucide-react';
import { Deck } from '../types/flashcard';
import { Mascot } from './Mascot';
import { sounds } from '../utils/audio';

interface CreateFolderViewProps {
  onBack: () => void;
  onFolderCreated: (deck: Deck) => void;
}

export const CreateFolderView: React.FC<CreateFolderViewProps> = ({
  onBack,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState('Japanese JLPT N3 Vocabulary');
  const [description, setDescription] = useState(
    'รวมคำศัพท์เตรียมสอบไวยากรณ์และคันจิระดับกลาง พร้อมตัวอย่างประโยคช่วยจำ'
  );
  const [category, setCategory] = useState('เตรียมสอบ');
  const [colorTheme, setColorTheme] = useState<'blue' | 'pink' | 'sage' | 'sand' | 'lavender'>('blue');
  const [selectedIcon, setSelectedIcon] = useState('target');

  const categories = [
    { label: 'เตรียมสอบ', icon: '🎯' },
    { label: 'สนทนา & ความรู้สึก', icon: '💬' },
    { label: 'การทำงาน & ธุรกิจ', icon: '💼' },
    { label: 'ท่องเที่ยว & คาเฟ่', icon: '☕' },
    { label: 'ภาษาที่ 3', icon: '🌸' },
    { label: 'คำศัพท์ทั่วไป', icon: '📖' },
  ];

  const colorOptions = [
    { id: 'blue' as const, name: 'ฟ้าละมุน (Cozy Sky)', bg: 'bg-[#DCEBFA]', border: 'border-[#A8BDD2]' },
    { id: 'pink' as const, name: 'ชมพูหวาน (Soft Blush)', bg: 'bg-[#F5DFE5]', border: 'border-[#d6c1c7]' },
    { id: 'sage' as const, name: 'เขียวมัทฉะ (Matcha Tea)', bg: 'bg-[#e1ece3]', border: 'border-[#81a68d]' },
    { id: 'sand' as const, name: 'เหลืองเนย (Warm Butter)', bg: 'bg-[#f4ebd0]', border: 'border-[#cfc199]' },
    { id: 'lavender' as const, name: 'ม่วงอ่อน (Sweet Lavender)', bg: 'bg-[#e6ebfa]', border: 'border-[#cbd2e6]' },
  ];

  const iconOptions = [
    { id: 'target', icon: '🎯' },
    { id: 'folder', icon: '📁' },
    { id: 'book', icon: '📖' },
    { id: 'coffee', icon: '☕' },
    { id: 'plane', icon: '✈️' },
    { id: 'briefcase', icon: '💼' },
    { id: 'sakura', icon: '🌸' },
    { id: 'paw', icon: '🐾' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    sounds.playStamp();
    sounds.playSuccessChime();

    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      title: folderName.trim(),
      titleThai: description.trim(),
      description: description.trim(),
      category,
      color: colorTheme,
      createdAt: Date.now(),
      cards: [],
    };

    onFolderCreated(newDeck);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none">
      {/* Top Breadcrumb */}
      <div>
        <p className="text-xs text-[#74777c] font-['Anuphan',sans-serif] mb-1">
          สมุดคำศัพท์ของฉัน &gt; คลังโฟลเดอร์ทั้งหมด &gt; สร้างโฟลเดอร์ใหม่
        </p>
        <button
          onClick={() => {
            sounds.playRingClick();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#74777c] hover:text-[#1d1c16] font-['Anuphan',sans-serif]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับไปหน้าโฟลเดอร์ทั้งหมด</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1c16] font-['Anuphan',sans-serif] flex items-center gap-2">
          <span>สร้างโฟลเดอร์คำศัพท์ใหม่</span>
          <span>📁✨</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#74777c] font-['Anuphan',sans-serif] mt-1 max-w-2xl leading-relaxed">
          ตั้งชื่อและปรับแต่งหน้าตาโฟลเดอร์สมุดคำศัพท์ของคุณ เลือกโทนสีพาสเทลและไอคอนที่เข้ากับธีมการเรียนรู้
        </p>
      </div>

      {/* Dual Column Layout: Left Form + Right Live Preview matching Image 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#EAE5DC] shadow-2xs space-y-5 paper-ruled">
          {/* Binder coils at top */}
          <div className="flex gap-6 -mt-2 mb-3 pointer-events-none">
            <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
            <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Folder Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#484A50] font-['Anuphan',sans-serif]">
                  ชื่อโฟลเดอร์ (Folder Name) *
                </label>
                <span className="text-[10px] text-[#74777c]">
                  {folderName.length} / 50
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={50}
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="เช่น Japanese JLPT N3 Vocabulary"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16]"
              />
              <p className="text-[10px] text-[#74777c] mt-1 font-['Anuphan',sans-serif]">
                แนะนำตั้งชื่อสั้นกระชับ เพื่อให้อ่านง่ายบนสันสมุดจด
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-1 font-['Anuphan',sans-serif]">
                คำอธิบาย / บันทึกย่อ (Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="รวมคำศัพท์เตรียมสอบไวยากรณ์และคันจิ..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs focus:outline-none focus:border-[#A8BDD2] text-[#1d1c16] font-['Anuphan',sans-serif] resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-2 font-['Anuphan',sans-serif]">
                หมวดหมู่การเรียนรู้ (Category)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playRingClick();
                      setCategory(c.label);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 font-['Anuphan',sans-serif] ${
                      category === c.label
                        ? 'bg-[#DCEBFA] text-[#52606d] border border-[#A8BDD2] font-semibold'
                        : 'bg-[#FAF9F6] text-[#484A50] border border-[#EAE5DC] hover:bg-[#EAE5DC]'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-2 font-['Anuphan',sans-serif]">
                เลือกโทนสีโฟลเดอร์พาสเทล (Color Theme)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      sounds.playRingClick();
                      setColorTheme(opt.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all ${opt.bg} ${opt.border} ${
                      colorTheme === opt.id ? 'ring-2 ring-[#52606d]' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white/80 border border-black/10 flex items-center justify-center">
                      {colorTheme === opt.id && <Check className="w-2.5 h-2.5 text-[#1d1c16]" />}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1d1c16] font-['Anuphan',sans-serif] truncate">
                      {opt.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#484A50] mb-2 font-['Anuphan',sans-serif]">
                สัญลักษณ์ / ไอคอนโฟลเดอร์
              </label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => {
                      sounds.playRingClick();
                      setSelectedIcon(ic.id);
                    }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border transition-transform ${
                      selectedIcon === ic.id
                        ? 'bg-[#DCEBFA] border-[#A8BDD2] scale-110 shadow-xs'
                        : 'bg-[#FAF9F6] border-[#EAE5DC] hover:scale-105'
                    }`}
                  >
                    {ic.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#EAE5DC] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-[#EAE5DC] hover:bg-[#ded9d1] text-xs font-semibold text-[#484A50]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#DCEBFA] hover:bg-[#c9e1f8] active:translate-y-[1px] text-[#1d1c16] text-xs font-bold border border-[#A8BDD2] transition-all shadow-xs flex items-center gap-1.5 font-['Anuphan',sans-serif]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#52606d]" />
                <span>+ สร้างและเริ่มเพิ่มคำศัพท์</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview matching Image 6 */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="flex items-center justify-between text-xs font-semibold text-[#74777c]">
            <span className="flex items-center gap-1 font-['Anuphan',sans-serif]">
              <span>👁️</span> ตัวอย่างโฟลเดอร์จริง (Live Preview)
            </span>
            <span className="text-[10px] text-[#52606d] bg-[#DCEBFA] px-2 py-0.5 rounded-full">
              อัปเดตแบบเรียลไทม์
            </span>
          </div>

          {/* Live Card */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 border-[1.5px] border-[#A8BDD2] shadow-sm relative overflow-hidden paper-ruled">
            {/* Top Rings */}
            <div className="absolute -top-3 left-8 flex gap-6 pointer-events-none">
              <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
              <div className="w-3.5 h-6 rounded-full metallic-ring border border-[#A8BDD2]/70" />
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[#74777c] font-medium font-['Anuphan',sans-serif]">
                  • {category}
                </span>
                <span className="text-[10px] text-[#74777c]">0 / 50 คำ</span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-[#DCEBFA] border border-[#A8BDD2] flex items-center justify-center text-xl shrink-0">
                  {iconOptions.find((i) => i.id === selectedIcon)?.icon || '📁'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1d1c16] leading-tight">
                    {folderName || 'ชื่อโฟลเดอร์ของคุณ'}
                  </h3>
                  <p className="text-[10px] text-[#74777c] mt-0.5 font-['Anuphan',sans-serif]">
                    สร้างเมื่อ: วันนี้ • ยังไม่มีคำศัพท์
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#74777c] font-['Anuphan',sans-serif] leading-relaxed mb-4">
                {description || 'คำอธิบายโฟลเดอร์สำหรับท่องคำศัพท์'}
              </p>

              {/* Sample card row inside */}
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] text-xs font-['Anuphan',sans-serif] text-[#484A50] flex items-center justify-between">
                <span>約束 (やくそく) • สัญญา / นัดหมาย</span>
                <span className="text-[10px] text-[#74777c]">ตัวอย่างการ์ด</span>
              </div>
            </div>
          </div>

          {/* Mascot Note */}
          <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EAE5DC] shadow-2xs flex items-center gap-3">
            <Mascot type="kitten" size="sm" />
            <p className="text-[11px] text-[#74777c] font-['Anuphan',sans-serif]">
              <strong className="text-[#1d1c16]">เคล็ดลับจากน้องคุกกี้ 🐾:</strong> สีพาสเทลช่วยลดความล้าของสายตาเมื่อต้องท่องศัพท์เป็นเวลานาน เลือกสีที่ถูกใจได้เลยนะเหมียว!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
