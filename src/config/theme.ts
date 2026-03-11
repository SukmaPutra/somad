// config/theme.ts

export const theme = {
  colors: {
    // ── Brand (Blue — tetap sama) ──────────────────────
    brand: {
      50:  '#eff6ff',
      100: '#dbeafe',
      400: '#60a5fa',
      500: '#137fec',  // main
      600: '#0d66c2',  // hover
      700: '#0b519b',  // active
    },

    // ── Dark Mode Surface ──────────────────────────────
    // Bukan plain slate — sedikit blue-tinted untuk kesan premium
    dark: {
      bg:        '#080d17',  // lebih dalam dari slate-900, sedikit navy
      surface:   '#0e1623',  // card utama
      elevated:  '#141f2e',  // card di atas surface (dropdown, modal)
      overlay:   '#1a2740',  // hover state
      border:    '#1e3050',  // border — biru gelap, bukan abu
      borderSub: '#162238',  // border lebih subtle
    },

    // ── Light Mode Surface ─────────────────────────────
    // Warm-white, bukan pure white yang menyilaukan
    light: {
      bg:        '#f4f6fb',  // sedikit blue-tinted white
      surface:   '#ffffff',
      elevated:  '#ffffff',
      overlay:   '#eef2f9',
      border:    '#dde3f0',
      borderSub: '#eaeff8',
    },

    // ── Text ───────────────────────────────────────────
    text: {
      // dark mode
      dark: {
        primary:   '#e8edf5',  // bukan pure white — lebih nyaman di mata
        secondary: '#8fa3c0',  // blue-grey
        muted:     '#4e6480',
        subtle:    '#2d4460',
      },
      // light mode
      light: {
        primary:   '#0d1b2e',
        secondary: '#3d5273',
        muted:     '#7390b0',
        subtle:    '#a8bdd4',
      },
    },

    // ── Semantic ───────────────────────────────────────
    success: '#10b981',  // emerald — lebih segar dari green-500
    warning: '#f59e0b',
    error:   '#f43f5e',  // rose — lebih stylish dari red-500
    info:    '#137fec',

    // ── Social-specific ────────────────────────────────
    like:      '#f43f5e',
    repost:    '#10b981',
    bookmark:  '#f59e0b',
    verified:  '#137fec',
  },

  // ── Gradient Presets ────────────────────────────────
  gradients: {
    brand:     'linear-gradient(135deg, #137fec 0%, #6366f1 100%)',  // blue → indigo
    brandSoft: 'linear-gradient(135deg, #137fec22 0%, #6366f111 100%)',
    surface:   'linear-gradient(180deg, #0e1623 0%, #080d17 100%)',
    card:      'linear-gradient(145deg, #141f2e 0%, #0e1623 100%)',
  },

  typography: {
    fontFamily: {
      sans: ['Plus Jakarta Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs:   '0.75rem',
      sm:   '0.875rem',
      base: '1rem',
      lg:   '1.125rem',
      xl:   '1.25rem',
      '2xl':'1.5rem',
      '3xl':'1.875rem',
    },
    fontWeight: {
      normal:   '400',
      medium:   '500',
      semibold: '600',
      bold:     '700',
    },
  },

  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl': '1536px',
  },

  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
  },

  borderRadius: {
    sm:     '6px',
    custom: '10px',
    lg:     '14px',
    xl:     '18px',
    full:   '9999px',
  },

  shadows: {
    // Dark mode — blue-tinted shadow
    dark: {
      sm:   '0 1px 3px 0 rgb(0 8 20 / 0.4)',
      md:   '0 4px 12px -2px rgb(0 8 20 / 0.5)',
      lg:   '0 8px 24px -4px rgb(0 8 20 / 0.6)',
      glow: '0 0 20px rgb(19 127 236 / 0.15)',  // brand glow
    },
    // Light mode — soft natural shadow
    light: {
      sm:   '0 1px 3px 0 rgb(13 27 46 / 0.06)',
      md:   '0 4px 12px -2px rgb(13 27 46 / 0.08)',
      lg:   '0 8px 24px -4px rgb(13 27 46 / 0.10)',
      glow: '0 0 20px rgb(19 127 236 / 0.12)',
    },
  },

  zIndex: {
    dropdown: 10,
    sticky:   20,
    overlay:  30,
    modal:    40,
    toast:    50,
  },
} as const;

export type AppTheme = typeof theme;