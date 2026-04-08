export interface Member {
  id: string;
  name: string;
  role: string;
  mbti: string;
  birthday: string;
  personality: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];
