/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffefd6',
          200: '#ffd9a3',
          300: '#ffbe65',
          400: '#ff9a2d',
          500: '#f57c00',
          600: '#e06500',
          700: '#ba4d00',
          800: '#963d00',
          900: '#7a3300',
        },
        kashmir: {
          50: '#f0f4ff',
          100: '#dce6ff',
          200: '#b9cdff',
          300: '#87aaff',
          400: '#527cff',
          500: '#2b4fff',
          600: '#1330f5',
          700: '#1022d6',
          800: '#141dac',
          900: '#161e88',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f9ecda',
          200: '#f2d5b0',
          300: '#e8b87d',
          400: '#dc9448',
          500: '#c97828',
          600: '#b8611d',
          700: '#98481a',
          800: '#7b3b1d',
          900: '#65321c',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        devanagari: ['var(--font-devanagari)', 'serif'],
      },
      backgroundImage: {
        'temple-pattern': "url('/patterns/temple.svg')",
        'lotus-pattern': "url('/patterns/lotus.svg')",
      },
      boxShadow: {
        premium: '0 4px 16px -2px rgba(101, 50, 28, 0.10), 0 2px 6px -2px rgba(101, 50, 28, 0.06)',
        'premium-lg': '0 12px 32px -6px rgba(101, 50, 28, 0.14), 0 6px 14px -6px rgba(101, 50, 28, 0.08)',
        'premium-xl': '0 24px 56px -12px rgba(101, 50, 28, 0.18), 0 10px 24px -10px rgba(101, 50, 28, 0.10)',
        glow: '0 0 0 1px rgba(245, 124, 0, 0.08), 0 8px 28px -6px rgba(245, 124, 0, 0.22)',
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-468px 0' },
          '100%': { backgroundPosition: '468px 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
