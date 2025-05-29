/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        background: '#031926',
        surface: '#0B2E3F',
        accent: '#00CFFF',
        text: '#FFFFFF',
        subtext: '#7AC8F9',
        "green-text": "#4ade80",
      },
    },
  },
  plugins: [],
}