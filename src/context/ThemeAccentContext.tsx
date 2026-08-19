import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentColor = 'emerald' | 'cyan' | 'violet' | 'rose';

export interface AccentTheme {
  id: AccentColor;
  name: string;
  primary: string; // Hex / Tailwind
  secondary: string;
  glow: string;
  bgLight: string;
  bgDark: string;
  badgeBg: string;
  borderClass: string;
  buttonClass: string;
  textClass: string;
}

export const ACCENT_THEMES: Record<AccentColor, AccentTheme> = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Islami',
    primary: '#059669',
    secondary: '#10b981',
    glow: 'rgba(16, 185, 129, 0.35)',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan Futuristik',
    primary: '#0891b2',
    secondary: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.35)',
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-cyan-950/40',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500/60',
    buttonClass: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/20',
    textClass: 'text-cyan-600 dark:text-cyan-400',
  },
  violet: {
    id: 'violet',
    name: 'Violet Royal Turats',
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.35)',
    bgLight: 'bg-purple-50',
    bgDark: 'bg-purple-950/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
    borderClass: 'border-purple-500/30 hover:border-purple-500/60',
    buttonClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20',
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  rose: {
    id: 'rose',
    name: 'Rose Koral Hangat',
    primary: '#e11d48',
    secondary: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.35)',
    bgLight: 'bg-rose-50',
    bgDark: 'bg-rose-950/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300',
    borderClass: 'border-rose-500/30 hover:border-rose-500/60',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20',
    textClass: 'text-rose-600 dark:text-rose-400',
  },
};

interface ThemeAccentContextType {
  accent: AccentColor;
  theme: AccentTheme;
  setAccent: (accent: AccentColor) => void;
}

const ThemeAccentContext = createContext<ThemeAccentContextType | undefined>(undefined);

const ACCENT_STORAGE_KEY = 'aji_pai_accent_color';

export const ThemeAccentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor;
    return saved && ACCENT_THEMES[saved] ? saved : 'emerald';
  });

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem(ACCENT_STORAGE_KEY, newAccent);
  };

  const currentTheme = ACCENT_THEMES[accent];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', currentTheme.primary);
    root.style.setProperty('--brand-secondary', currentTheme.secondary);
    root.style.setProperty('--brand-glow', currentTheme.glow);
  }, [currentTheme]);

  return (
    <ThemeAccentContext.Provider value={{ accent, theme: currentTheme, setAccent }}>
      {children}
    </ThemeAccentContext.Provider>
  );
};

export const useThemeAccent = () => {
  const context = useContext(ThemeAccentContext);
  if (!context) {
    throw new Error('useThemeAccent must be used within ThemeAccentProvider');
  }
  return context;
};
