import type { Config } from 'tailwindcss'
import twElements from 'tw-elements/dist/plugin'

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require("tw-elements/dist/plugin.cjs")
    twElements
  ],
  darkMode: "class",
}

export default config
