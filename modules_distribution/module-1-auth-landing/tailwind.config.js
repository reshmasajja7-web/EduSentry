/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],

  theme: {
    extend: {
      colors: {
        /* =========================
           DARK THEME
        ========================= */

        // Main dark UI
        navy: '#0d1626',
        navyDim: '#142036',

        // Gold accent
        gold: '#E8A33D',
        goldTint: '#3A2B16',

        // Text colors (Optimized for maximum contrast & crisp readability)
        ink: '#FFFFFF',
        slate: '#F1F5F9',
        muted: '#CBD5E1',

        // Background colors
        paper: '#0f182a',
        surface: '#070b14',

        // Borders
        line: '#1c2b44',

        // Success
        sage: '#72B58F',
        sageTint: '#173326',

        // Error
        rust: '#E06B59',
        rustTint: '#3A1E1A',
      },

      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },

  plugins: [],
}