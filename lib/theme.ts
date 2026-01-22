import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(47 28% 86%)', // Your Beige (#E6E2D3)
    foreground: 'hsl(240 5% 11%)', // Your Dark Text (#1A1A1D)
    card: 'hsl(47 28% 86%)',       // Match background for clean headers
    cardForeground: 'hsl(240 5% 11%)',
    popover: 'hsl(47 28% 86%)',
    popoverForeground: 'hsl(240 5% 11%)',
    primary: 'hsl(239 84% 67%)',   // Your Indigo (#6366F1)
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(240 4% 18%)',  // Your Secondary (#2B2B2F)
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(240 5% 26%)',      // Your Gray (#3F3F46)
    mutedForeground: 'hsl(240 5% 65%)',
    accent: 'hsl(240 5% 96%)',
    accentForeground: 'hsl(240 5% 11%)',
    destructive: 'hsl(0 48% 57%)', // Your Danger (#C75B5B)
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(239 84% 67%)',
    radius: '0.5rem',
  },
  dark: {
    background: 'hsl(240 5% 11%)', // Your Dark Background (#1A1A1D)
    foreground: 'hsl(47 28% 86%)', // Your Beige Text
    card: 'hsl(240 5% 11%)',
    cardForeground: 'hsl(47 28% 86%)',
    popover: 'hsl(240 5% 11%)',
    popoverForeground: 'hsl(47 28% 86%)',
    primary: 'hsl(239 84% 67%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(240 4% 18%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(240 5% 26%)',
    mutedForeground: 'hsl(240 5% 65%)',
    accent: 'hsl(240 4% 18%)',
    accentForeground: 'hsl(47 28% 86%)',
    destructive: 'hsl(0 48% 57%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(240 4% 18%)',
    input: 'hsl(240 4% 18%)',
    ring: 'hsl(239 84% 67%)',
    radius: '0.5rem',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};