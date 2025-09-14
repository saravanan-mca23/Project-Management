/** @type {import('tailwindcss').Config} */
module.exports = {
content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
theme: {
extend: {
colors: {
primary: '#0f766e',
surface: '#0f172a'
},
boxShadow: {
'soft-lg': '0 10px 30px rgba(2,6,23,0.35)'
}
},
},
plugins: [],
}