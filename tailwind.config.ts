import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'omni-gold': '#FFD700',
        'omni-purple': '#9333EA',
        'scroll-blue': '#3B82F6',
        'zakat-green': '#10B981',
      },
    },
  },
}
export default config
