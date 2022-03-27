module.exports = {
  // Uncomment the line below to enable the experimental Just-in-Time ("JIT") mode.
  // https://tailwindcss.com/docs/just-in-time-mode
  // mode: "jit",
  theme: {
    extend: {    
        fontFamily: {
        futura: ["Futura"]
      },
      colors: {
        arctic: "#010C30",
        cyanic: "#0047B0",
        frost: "#CFDAFF",
        arcticLight: "#3F4B71",
        ice: "#07559D",
        coal: "#192538",
        grass: "#4FCAFF",
        petal: "#9955EF"
      },
    },
  },
  variants: {},
  plugins: [],
  purge: {
    // Filenames to scan for classes
    content: [
      "./src/**/*.html",
      "./src/**/*.js",
      "./src/**/*.jsx",
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "./public/index.html",
    ],
    // Options passed to PurgeCSS
    options: {
      // Whitelist specific selectors by name
      // safelist: [],
    },
  },
};
