import type { Level, ThemeData } from '../data/types';
import { themes } from '../data/index';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  level: Level;
  onSelect: (theme: ThemeData) => void;
  onBack: () => void;
  completedThemes?: string[];
}

const levelColors: Record<Level, string> = {
  children: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
  beginner: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)',
  intermediate: 'linear-gradient(135deg, #B8D4FF 0%, #FFFFFF 100%)',
  advanced: 'linear-gradient(135deg, #C8EEFF 0%, #B8F0E6 100%)',
};

const themeColors = [
  '#FFD6E8', '#B8F0E6', '#B8D4FF', '#FFF5B8',
  '#C8EEFF', '#FFD6E8', '#B8F0E6', '#FFF5B8',
  '#D4B8FF',
];

export default function ThemeSelect({ level, onSelect, onBack, completedThemes = [] }: Props) {
  const { lang, t } = useLanguage();
  const levelLabel = t[`level_${level}` as keyof typeof t] as string;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: 16,
            width: 44,
            height: 44,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: 22,
            fontWeight: 900,
            color: 'var(--text-dark)',
            margin: 0,
            fontFamily: "'Jua', sans-serif",
          }}>
            {t.chooseTheme}
          </h2>
          <div style={{
            display: 'inline-block',
            background: levelColors[level],
            borderRadius: 12,
            padding: '2px 12px',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginTop: 4,
          }}>
            {lang === 'ko' ? `${levelLabel} 레벨` : levelLabel}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 18,
        color: 'var(--text-soft)',
        marginBottom: 24,
        fontWeight: 600,
        textAlign: 'center',
      }}>
        {t.whatToLearn}
      </p>

      {/* Theme Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        flex: 1,
      }}>
        {themes.map((theme, i) => {
          const done = completedThemes.includes(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              className="theme-card-btn"
              style={{
                background: `linear-gradient(135deg, ${themeColors[i]} 0%, #FFFFFF 100%)`,
                border: done ? '2px solid rgba(100,200,150,0.5)' : 'none',
                borderRadius: 24,
                padding: '20px 16px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                minHeight: 120,
                position: 'relative',
              }}
            >
              {done && (
                <span style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  fontSize: 16,
                }}>✅</span>
              )}
              <span style={{ fontSize: 40 }}>{theme.emoji}</span>
              <span style={{
                fontSize: 16,
                fontWeight: 900,
                color: 'var(--text-dark)',
                fontFamily: "'Jua', sans-serif",
                lineHeight: 1.3,
              }}>
                {theme.title}
              </span>
              <span style={{
                fontSize: 13,
                color: 'var(--text-soft)',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 10,
                padding: '2px 8px',
                fontWeight: 700,
              }}>
                {lang === 'ko' ? `${theme.words.length}개 단어` : `${theme.words.length} words`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
