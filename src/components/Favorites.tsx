import type { ThemeData, WordData } from '../data/types';
import { themes } from '../data/index';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  favorites: string[];
  onToggleFavorite: (word: string) => void;
  onStartQuiz: (theme: ThemeData) => void;
}

function speakText(text: string) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}

export default function Favorites({ favorites, onToggleFavorite, onStartQuiz }: Props) {
  const { lang, t } = useLanguage();

  const allWords = themes.flatMap((th) => th.words);
  const seen = new Set<string>();
  const favoriteWords: WordData[] = [];
  for (const w of allWords) {
    if (favorites.includes(w.word) && !seen.has(w.word)) {
      seen.add(w.word);
      favoriteWords.push(w);
    }
  }

  const handleStartQuiz = () => {
    const favTheme: ThemeData = {
      id: 'favorites',
      title: t.favorites,
      titleEn: 'Favorites',
      emoji: '⭐',
      words: favoriteWords,
    };
    onStartQuiz(favTheme);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: 0,
          fontFamily: "'Jua', sans-serif",
        }}>
          ⭐ {t.favorites}
        </h2>
        {favoriteWords.length > 0 && (
          <p style={{
            fontSize: 14,
            color: 'var(--text-soft)',
            fontWeight: 700,
            margin: '4px 0 0',
          }}>
            {lang === 'ko' ? `${favoriteWords.length}개 단어` : `${favoriteWords.length} words`}
          </p>
        )}
      </div>

      {favoriteWords.length === 0 ? (

        /* Empty state */
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          textAlign: 'center',
          paddingBottom: 80,
        }}>
          <span style={{ fontSize: 72, opacity: 0.4 }}>☆</span>
          <p style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text-dark)',
            margin: 0,
          }}>
            {t.noFavorites}
          </p>
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text-soft)',
            margin: 0,
            maxWidth: 280,
            lineHeight: 1.6,
          }}>
            {t.favoritesHint}
          </p>
        </div>

      ) : (
        <>
          {/* Quiz button */}
          <button
            onClick={handleStartQuiz}
            style={{
              background: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
              border: 'none',
              borderRadius: 20,
              padding: '16px',
              fontSize: 17,
              fontWeight: 900,
              color: 'var(--text-dark)',
              cursor: 'pointer',
              fontFamily: "'Jua', sans-serif",
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              marginBottom: 20,
              width: '100%',
            }}
          >
            ⭐ {t.favoriteQuiz} ({favoriteWords.length})
          </button>

          {/* Word list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {favoriteWords.map((word) => (
              <div
                key={word.word}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 20,
                  padding: '16px 18px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span
                  style={{ fontSize: 36, flexShrink: 0, cursor: 'pointer', lineHeight: 1 }}
                  onClick={() => speakText(word.word)}
                >
                  {word.emoji}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: 'var(--text-dark)',
                    fontFamily: "'Jua', sans-serif",
                    lineHeight: 1.2,
                  }}>
                    {word.word}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--text-soft)',
                    fontWeight: 600,
                    fontStyle: 'italic',
                    marginTop: 1,
                  }}>
                    {word.english}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--text-dark)',
                    fontWeight: 700,
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}>
                    {word.definition}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => speakText(word.word)}
                    title={t.listen}
                    style={{
                      background: 'rgba(184,212,255,0.4)',
                      border: 'none',
                      borderRadius: 12,
                      width: 36,
                      height: 36,
                      fontSize: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => onToggleFavorite(word.word)}
                    title={t.removeFavorite}
                    style={{
                      background: 'rgba(255,214,100,0.35)',
                      border: 'none',
                      borderRadius: 12,
                      width: 36,
                      height: 36,
                      fontSize: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
