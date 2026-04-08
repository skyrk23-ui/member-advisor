import { Member, Message } from './types';

const STORAGE_KEY = 'member-advisor-members';
const CHAT_KEY_PREFIX = 'member-advisor-chat-';

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
  localStorage.removeItem(CHAT_KEY_PREFIX + id);
}

export function getChatHistory(memberId: string): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CHAT_KEY_PREFIX + memberId);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(memberId: string, messages: Message[]): void {
  localStorage.setItem(CHAT_KEY_PREFIX + memberId, JSON.stringify(messages));
}

export function clearChatHistory(memberId: string): void {
  localStorage.removeItem(CHAT_KEY_PREFIX + memberId);
}
