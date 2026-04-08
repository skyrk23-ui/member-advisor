'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Member, MBTI_TYPES } from '@/lib/types';
import { saveMember } from '@/lib/storage';

interface Props {
  initial?: Member;
}

export default function MemberForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    role: initial?.role ?? '',
    mbti: initial?.mbti ?? '',
    birthday: initial?.birthday ?? '',
    personality: initial?.personality ?? '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const member: Member = {
      id: initial?.id ?? crypto.randomUUID(),
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      ...form,
    };
    saveMember(member);
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          名前 <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="例: 田中 太郎"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">役職</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="例: エンジニア、デザイナー、営業リーダー"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MBTI</label>
        <select
          name="mbti"
          value={form.mbti}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">選択してください</option>
          {MBTI_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">誕生日</label>
        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">性格・特徴</label>
        <textarea
          name="personality"
          value={form.personality}
          onChange={handleChange}
          rows={4}
          placeholder="例: 細かい作業が得意で真面目。褒められると伸びるが、批判には敏感。論理的な説明を好む。"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-medium hover:bg-gray-50 transition"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition"
        >
          {initial ? '更新する' : '追加する'}
        </button>
      </div>
    </form>
  );
}
