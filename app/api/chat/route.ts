import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';
import { Member, Message } from '@/lib/types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(member: Member): string {
  const age = member.birthday
    ? (() => {
        const birth = new Date(member.birthday);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
      })()
    : null;

  return `あなたは会社の社長の専属コミュニケーションアドバイザーです。
社長がメンバーへの声の掛け方・コミュニケーション方法を相談してきます。
以下のメンバー情報を深く理解した上で、具体的で実践的なアドバイスを日本語でしてください。

【メンバー情報】
名前: ${member.name}
役職: ${member.role || '未設定'}
MBTI: ${member.mbti || '未設定'}
誕生日: ${member.birthday || '未設定'}${age !== null ? `（${age}歳）` : ''}
性格・特徴: ${member.personality || '未設定'}

アドバイスの際は以下の観点を踏まえてください：
- このメンバーのMBTIや性格に合った声の掛け方
- モチベーションを上げる方法
- フィードバックや指摘の伝え方
- 注意すべきNG言動
- 役職に応じた適切な関わり方

具体的なシチュエーションや言葉の例を交えながら、社長として実践できるアドバイスをしてください。`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, member }: { messages: Message[]; member: Member } = await req.json();

    const systemPrompt = buildSystemPrompt(member);

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error(err);
    return new Response('エラーが発生しました', { status: 500 });
  }
}
