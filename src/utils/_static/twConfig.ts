import type { Config } from 'tailwindcss';
export const twConfig: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      textShadow: {
        purple:
          '-1px -1px 0 #7555DA, 1px -1px 0 #7555DA, -1px 1px 0 #7555DA, 1px 1px 0 #7555DA',
        white:
          '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white'
      },
      colors: {
        'seeds-purple': '#7555DA',
        'seeds-green': '#4FE6AF',
        'seeds-button-green': '#3AC4A0',
        'seeds-green-2': '#DCFCE4'
      },
      backgroundImage: {
        hello: "url('../src/assets/hello.png')",
        'ellipse-purple': "url('../src/assets/ellipse-purple.png')"
      },
      backgroundSize: {
        '50%': '50%',
        '60%': '60%',
        '70%': '70%',
        '80%': '80%',
        '90%': '90%',
        '100%': '100%',
        '120%': '120%',
        '140%': '140%',
        '160%': '160%',
        '180%': '180%'
      },
      rotate: {
        270: '270deg'
      },
      boxShadow: {
        center: '0 0px 1px 1px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: [require('tailwindcss-textshadow')]
};
