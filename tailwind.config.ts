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
        'slide-up': 'slideUp 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
      },
      // Typography system: Line heights based on font weight
      // Regular (400): font-size + 8px
      // Medium (500), Semibold (600), Bold (700): font-size + 4px
      lineHeight: {
        // For Regular (400) weight
        'regular-xs': '20px',   // 12px + 8px
        'regular-sm': '22px',   // 14px + 8px
        'regular-base': '24px', // 16px + 8px
        'regular-lg': '26px',   // 18px + 8px
        'regular-xl': '28px',   // 20px + 8px
        'regular-2xl': '32px',  // 24px + 8px
        'regular-30': '38px',   // 30px + 8px
        // For Medium (500), Semibold (600), Bold (700) weights
        'bold-xs': '16px',      // 12px + 4px
        'bold-sm': '18px',      // 14px + 4px
        'bold-base': '20px',    // 16px + 4px
        'bold-lg': '22px',      // 18px + 4px
        'bold-xl': '24px',      // 20px + 4px
        'bold-2xl': '28px',     // 24px + 4px
        'bold-30': '34px',      // 30px + 4px
      },
    },
  },
  plugins: [],
}

export default config


