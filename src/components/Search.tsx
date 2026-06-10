import { useState } from 'react';
import type { ReactNode } from 'react';
import { themes } from '../data/index';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  favorites: string[];
  onToggleFavorite: (word: string) => void;
  onClose: () => void;
}

function speakText(text: string) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

function highlight(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ background: '#B8F0E6', borderRadius: 3, padding: '0 2px', fontWeight: 900 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Search({ favorites, onToggleFavorite, onClose }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const allWords = themes.flatMap(th => th.words.map(w => ({ ...w, themeTitle: th.title, themeEmoji: th.emoji })));
  const seen = new Set<string>();
  const results = query.trim().length === 0 ? [] : allWords.filter(w => {
    if (seen.has(w.word)) return false;
    const q = query.toLowerCase();
    const match = w.word.toLowerCase().includes(q) || w.english.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q);
    if (match) seen.add(w.word);
    return match;
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.38)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Search input box */}
      <div style={{
        width: '100%', maxWidth: 600,
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 24,
        padding: '14px 18px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20 }}>🔍</span>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--text-dark)',
            background: 'transparent',
            fontFamily: "'Jua', 'Nunito', sans-serif",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-soft)', lineHeight: 1, padding: '0 4px' }}
          >✕</button>
        )}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 10,
            padding: '5px 12px', fontSize: 13, fontWeight: 800,
            cursor: 'pointer', color: 'var(--text-soft)',
          }}
        >
          {t.search === '검색' ? '닫기' : 'Close'}
        </button>
      </div>

      {/* Results */}
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {query.trim().length > 0 && results.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, padding: '60px 0', textAlign: 'center',
          }}>
            <span style={{ fontSize: 56, opacity: 0.4 }}>🔍</span>
            <p style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {t.searchNoResult}
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600, margin: 0 }}>
              Try searching in English or Korean
            </p>
          </div>
        )}

        {results.map(word => (
          <div
            key={word.word}
            style={{
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 20,
              padding: '14px 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 32, flexShrink: 0, lineHeight: 1 }}>{word.emoji}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                <span style={{
                  fontSize: 20, fontWeight: 900,
                  color: 'var(--text-dark)',
                  fontFamily: "'Jua', sans-serif",
                }}>
                  {highlight(word.word, query)}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'linear-gradient(135deg, #B8F0E6, #B8D4FF)',
                  borderRadius: 8, padding: '2px 8px',
                  color: 'var(--text-dark)', whiteSpace: 'nowrap',
                }}>
                  {word.themeEmoji} {word.themeTitle}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-soft)', fontStyle: 'italic', fontWeight: 600 }}>
                {highlight(word.english, query)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dark)', fontWeight: 700, marginTop: 2, lineHeight: 1.4 }}>
                {highlight(word.definition, query)}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => speakText(word.word)}
                title={t.listen}
                style={{
                  background: 'rgba(184,212,255,0.4)', border: 'none', borderRadius: 12,
                  width: 36, height: 36, fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >🔊</button>
              <button
                onClick={() => onToggleFavorite(word.word)}
                title={favorites.includes(word.word) ? t.removeFavorite : t.favorites}
                style={{
                  background: favorites.includes(word.word) ? 'rgba(255,214,100,0.35)' : 'rgba(255,255,255,0.8)',
                  border: 'none', borderRadius: 12,
                  width: 36, height: 36, fontSize: 16, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {favorites.includes(word.word) ? '⭐' : '☆'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
