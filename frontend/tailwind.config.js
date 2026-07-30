/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        backgroundAlt: '#F1EDE7',
        primary: {
          DEFAULT: '#1B2A4A',
          dark: '#0F1B33'
        },
        accentGold: '#C9A45C',
        textMain: '#2B2B2B',
        textMuted: '#6B6B6B',
        success: '#3E7A5C',
        borderSoft: '#E4DED4'
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px'
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10)'
      },
      maxWidth: {
        container: '1280px'
      }
      // Pas besoin de redéfinir "spacing" : les valeurs 4px/8px/16px/24px/40px/64px/80px
      // correspondent déjà aux tokens natifs de Tailwind (p-1, p-2, p-4, p-6, p-10, p-16, p-20).
    },
  },
  plugins: [],
}