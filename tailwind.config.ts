import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a1a1a1',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
        },
        amber: {
          100: '#fef3c6',
          600: '#e17100',
          700: '#bb4d00',
        },
        green: {
          100: '#dcfce7',
          700: '#008236',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          400: '#00d5be',
          700: '#00786f',
        },
        yellow: {
          50: '#fefce8',
        },
        purple: {
          100: '#f3e8ff',
        },
      },
      fontFamily: {
        sans: ['"Mona Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config


