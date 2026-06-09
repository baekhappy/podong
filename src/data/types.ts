export interface WordData {
  word: string;
  english: string;
  definition: string;
  definitionEn: string;
  exampleChildren: string;
  exampleChildrenEn: string;
  exampleBeginner: string;
  exampleBeginnerEn: string;
  exampleIntermediate: string;
  exampleAdvanced: string;
  animationType: string;
  soundType: string;
  emoji: string;
}

export interface ThemeData {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  words: WordData[];
}

export type Level = 'children' | 'beginner' | 'intermediate' | 'advanced';
export type Screen = 'level' | 'theme' | 'study' | 'quiz' | 'result' | 'progress';
