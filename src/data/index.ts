import type { ThemeData } from './types';
import 동물소리Words from './동물소리';
import 날씨자연Words from './날씨자연';
import 감정심리Words from './감정심리';
import 움직임Words from './움직임';
import 빛모양Words from './빛모양';
import 음식먹기Words from './음식먹기';
import 상태느낌Words from './상태느낌';
import 소리충격Words from './소리충격';

export const themes: ThemeData[] = [
  {
    id: '동물소리',
    title: '동물 소리',
    emoji: '🐾',
    words: 동물소리Words,
  },
  {
    id: '날씨자연',
    title: '날씨·자연',
    emoji: '🌈',
    words: 날씨자연Words,
  },
  {
    id: '감정심리',
    title: '감정·심리',
    emoji: '💝',
    words: 감정심리Words,
  },
  {
    id: '움직임',
    title: '움직임',
    emoji: '🏃',
    words: 움직임Words,
  },
  {
    id: '빛모양',
    title: '빛·모양',
    emoji: '✨',
    words: 빛모양Words,
  },
  {
    id: '음식먹기',
    title: '음식·먹기',
    emoji: '🍜',
    words: 음식먹기Words,
  },
  {
    id: '상태느낌',
    title: '상태·느낌',
    emoji: '🌿',
    words: 상태느낌Words,
  },
  {
    id: '소리충격',
    title: '소리·충격',
    emoji: '💥',
    words: 소리충격Words,
  },
];

export type { ThemeData, WordData, Level, Screen } from './types';
