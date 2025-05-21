/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Add this line to tell Tailwind where to look for class names
  ],
  theme: {
    extend: {
      colors: {
        // Custom Colors (You can add your brand colors here)
        'primary': '#1D4ED8',  // Tailwind Blue
        'secondary': '#6366F1', // Tailwind Indigo
      },
      fontFamily: {
        // Example of a custom font (you can use Google Fonts or your custom font)
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      screens: {
        // Custom breakpoints (Optional: Tailwind comes with defaults)
        'xxl': '1440px', // Custom screen size for larger screens
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here if necessary (like forms, typography, etc.)
  ],
}
