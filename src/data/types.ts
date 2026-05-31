export interface WordData {
  word: string;
  english: string;
  definition: string;
  exampleBeginner: string;
  exampleIntermediate: string;
  exampleAdvanced: string;
  animationType: string;
  soundType: string;
  emoji: string;
}

export interface ThemeData {
  id: string;
  title: string;
  emoji: string;
  words: WordData[];
}

export type Level = 'children' | 'beginner' | 'intermediate' | 'advanced';
export type Screen = 'level' | 'theme' | 'study' | 'quiz' | 'result';
