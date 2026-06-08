import type { Level } from '../data/types';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onSelect: (level: Level) => void;
}

const levelsMeta: {
  id: Level;
  emoji: string;
  bg: string;
  accent: string;
  featuresKo: string[];
  featuresEn: string[];
}[] = [
  {
    id: 'children',
    emoji: '🌈',
    bg: 'linear-gradient(135deg, #FFD6E8 0%, #FFF5B8 100%)',
    accent: '#FFD6E8',
    featuresKo: ['큰 이모지', '한글만', '쉬운 퀴즈'],
    featuresEn: ['Emoji', 'Korean only', 'Easy quiz'],
  },
  {
    id: 'beginner',
    emoji: '🌱',
    bg: 'linear-gradient(135deg, #B8F0E6 0%, #FFFFFF 100%)',
    accent: '#B8F0E6',
    featuresKo: ['영어 번역', '짧은 예문', '선택형 퀴즈'],
    featuresEn: ['English', 'Short examples', 'Multiple choice'],
  },
  {
    id: 'intermediate',
    emoji: '🌿',
    bg: 'linear-gradient(135deg, #B8D4FF 0%, #FFFFFF 100%)',
    accent: '#B8D4FF',
    featuresKo: ['영어 번역', '일상 예문', '빈칸 퀴즈'],
    featuresEn: ['English', 'Natural examples', 'Fill-in-blank'],
  },
  {
    id: 'advanced',
    emoji: '🌊',
    bg: 'linear-gradient(135deg, #C8EEFF 0%, #B8F0E6 100%)',
    accent: '#C8EEFF',
    featuresKo: ['번역 없음', '심화 예문', '도전 퀴즈'],
    featuresEn: ['No translation', 'Advanced examples', 'Challenge quiz'],
  },
];

export default function LevelSelect({ onSelect }: Props) {
  const { lang, t } = useLanguage();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>포동포동</div>
        <h1 style={{
          fontSize: 32,
          fontWeight: 900,
          color: 'var(--text-dark)',
          margin: '0 0 8px',
          fontFamily: "'Jua', 'Nunito', sans-serif",
        }}>
          {t.appSubtitle}
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-soft)', fontWeight: 600 }}>
          Korean Sound & Action Words
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 440 }}>
        <p style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-dark)',
          marginBottom: 20,
          fontFamily: "'Jua', sans-serif",
        }}>
          {t.chooseLevel}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {levelsMeta.map((lv) => {
            const label = t[`level_${lv.id}` as keyof typeof t] as string;
            const desc = t[`level_${lv.id}_desc` as keyof typeof t] as string;
            const features = lang === 'ko' ? lv.featuresKo : lv.featuresEn;
            return (
              <button
                key={lv.id}
                onClick={() => onSelect(lv.id)}
                className="level-card-btn"
                style={{
                  background: lv.bg,
                  border: 'none',
                  borderRadius: 24,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 48 }}>{lv.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{
                        fontSize: 24,
                        fontWeight: 900,
                        color: 'var(--text-dark)',
                        fontFamily: "'Jua', sans-serif",
                      }}>
                        {label}
                      </span>
                    </div>
                    <p style={{ fontSize: 16, color: 'var(--text-soft)', margin: '4px 0 8px', fontWeight: 600 }}>
                      {desc}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {features.map((f) => (
                        <span key={f} style={{
                          fontSize: 13,
                          background: 'rgba(255,255,255,0.7)',
                          borderRadius: 12,
                          padding: '3px 10px',
                          color: 'var(--text-dark)',
                          fontWeight: 700,
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
