import React from 'react';
import { BookOpen, Sparkles, Quote } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isUser?: boolean;
}

function isArabicLine(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text) && text.replace(/[^\u0600-\u06FF\s]/g, '').length > text.length * 0.4;
}

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold break-words">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded-md bg-white/10 text-gold-300 text-sm font-mono break-all">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*')) {
      parts.push(
        <em key={match.index} className="italic text-white/80">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function BlockCard({
  type,
  children,
}: {
  type: 'quran' | 'hadith' | 'dua' | 'note';
  children: React.ReactNode;
}) {
  const styles = {
    quran: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      icon: <BookOpen size={16} className="text-emerald-400" />,
      label: 'Quranic Reference',
      labelColor: 'text-emerald-400',
    },
    hadith: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      icon: <Quote size={16} className="text-amber-400" />,
      label: 'Hadith',
      labelColor: 'text-amber-400',
    },
    dua: {
      border: 'border-gold-500/30',
      bg: 'bg-gold-500/5',
      icon: <Sparkles size={16} className="text-gold-400" />,
      label: 'Dua',
      labelColor: 'text-gold-400',
    },
    note: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      icon: <Sparkles size={16} className="text-blue-400" />,
      label: 'Note',
      labelColor: 'text-blue-400',
    },
  }[type];

  return (
    <div className={`my-5 rounded-2xl border ${styles.border} ${styles.bg} p-5 space-y-3`}>
      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${styles.labelColor}`}>
        {styles.icon}
        {styles.label}
      </div>
      <div className="space-y-3 text-[15px] leading-7 text-white/90">{children}</div>
    </div>
  );
}

function detectBlockType(line: string): 'quran' | 'hadith' | 'dua' | 'note' | null {
  const lower = line.toLowerCase();
  if (lower.includes('quran') || lower.includes('surah') || lower.includes('📖')) return 'quran';
  if (lower.includes('hadith') || lower.includes('📜') || lower.includes('reported by') || lower.includes('narrator:') || lower.includes('bukhari') || lower.includes('muslim') || lower.includes('tirmidhi')) return 'hadith';
  if (lower.includes('dua') || lower.includes('🤲') || lower.includes('arabic:') || lower.includes('transliteration')) return 'dua';
  if (lower.startsWith('>') || lower.includes('remember') || lower.includes('note:')) return 'note';
  return null;
}

function renderBlock(lines: string[], key: number): React.ReactNode {
  const firstLine = lines[0] || '';
  const blockType = detectBlockType(firstLine);
  const cleanedLines = lines.map((l) => l.replace(/^>\s*/, '').trim()).filter(Boolean);

  const body = cleanedLines.map((line, i) => {
    if (isArabicLine(line)) {
      return (
        <p key={i} className="arabic-text text-2xl text-right leading-[2.2] text-gold-200/95 py-2">
          {parseInline(line)}
        </p>
      );
    }

    if (/^(arabic|transliteration|translation|english|amharic):/i.test(line)) {
      const [label, ...rest] = line.split(':');
      return (
        <div key={i} className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label.trim()}</span>
          <p className="text-white/85">{parseInline(rest.join(':').trim())}</p>
        </div>
      );
    }

    if (line.startsWith('### ') || line.startsWith('## ') || line.startsWith('# ')) {
      const title = line.replace(/^#+\s*/, '');
      return (
        <h3 key={i} className="text-lg font-bold text-gold-300 tracking-tight pt-2">
          {parseInline(title)}
        </h3>
      );
    }

    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      return (
        <h3 key={i} className="text-base font-bold text-gold-300 tracking-tight pt-1">
          {parseInline(line.replace(/\*\*/g, ''))}
        </h3>
      );
    }

    if (/^[-•*]\s/.test(line)) {
      return (
        <li key={i} className="ml-5 list-disc marker:text-gold-500 text-white/85 leading-7">
          {parseInline(line.replace(/^[-•*]\s*/, ''))}
        </li>
      );
    }

    if (/^\d+\.\s/.test(line)) {
      return (
        <li key={i} className="ml-5 list-decimal marker:text-gold-500 text-white/85 leading-7">
          {parseInline(line.replace(/^\d+\.\s*/, ''))}
        </li>
      );
    }

    return (
      <p key={i} className="text-[15px] leading-8 text-white/88">
        {parseInline(line)}
      </p>
    );
  });

  if (blockType) {
    return (
      <BlockCard key={key} type={blockType}>
        {body}
      </BlockCard>
    );
  }

  return (
    <div key={key} className="space-y-4 my-4">
      {body}
    </div>
  );
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ content, isUser }) => {
  if (isUser) {
    return <p className="text-[15px] leading-relaxed font-medium">{content}</p>;
  }

  const paragraphs = content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const blocks: string[][] = [];

  for (const paragraph of paragraphs) {
    blocks.push(paragraph.split('\n').map((l) => l.trim()).filter(Boolean));
  }

  if (blocks.length === 0) {
    return <p className="text-[15px] leading-8 text-white/88">{content}</p>;
  }

  return (
    <article className="chat-prose space-y-2 max-w-none">
      {blocks.map((lines, i) => renderBlock(lines, i))}
    </article>
  );
};
