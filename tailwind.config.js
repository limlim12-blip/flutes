/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.html",
        "./**/*.templ", // <-- This is the crucial line
        "./**/*.go",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
}
