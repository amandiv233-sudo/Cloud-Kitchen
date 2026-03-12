import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f1f8f3',
          100: '#ddeee3',
          200: '#bedece',
          300: '#94c6af',
          400: '#67aa8d',
          500: '#468f71',  // Primary Brand color
          600: '#347259',
          700: '#2b5b49',
          800: '#24493c',
          900: '#1e3d33',
        },
        earth: {
          50: '#faf7f3',
          100: '#f3ece1',
          200: '#e5d5be',
          300: '#d3b793',
          400: '#c09564',
          500: '#b27b42',  // Accent Brand color
          600: '#a36336',
          700: '#884c2e',
          800: '#6f3f27',
          900: '#5a3422',
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
