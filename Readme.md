for tailwindcss postcss
npm install tailwindcss @tailwindcss/postcss

postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

index.css -> @import "tailwindcss";

main.jsx -> import './index.css'