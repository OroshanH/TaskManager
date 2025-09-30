export default {
  darkMode: "class", // Used to switch CSS to dark mode
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        active: "var(--color-active)",
        header: "var(--color-header)",
        card: "var(--color-card)",
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
        iconcolor: "var(--color-iconcolor)",
        iconbg: "var(--color-iconbg)",
        greentext: "var(--color-greentext)",
        greenbg: "var(--color-greenbg)",
        greenborder: "var(--color-greenborder)",
        yellowtext: "var(--color-yellowtext)",
        yellowbg: "var(--color-yellowbg)",
        yellowborder: "var(--color-yellowborder)",
        redtext: "var(--color-redtext)",
        redbg: "var(--color-redbg)",
        redborder: "var(--color-redborder)",
      },
    },
  },
  plugins: [],
};
