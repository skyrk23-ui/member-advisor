import { Member } from './types';

const STORAGE_KEY = 'member-advisor-members';

export function getMembers(): Member[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getMember(id: string): Member | null {
  return getMembers().find((m) => m.id === id) ?? null;
}

export function saveMember(member: Member): void {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === member.id);
  if (idx >= 0) {
    members[idx] = member;
  } else {
    members.push(member);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function deleteMember(id: string): void {
  const members = getMembers().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}
