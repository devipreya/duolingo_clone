export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: {
    colors: { duo: { green: "#58cc02", greenDark: "#58a700", blue: "#1cb0f6", blueDark: "#1899d6", blueBg: "#ddf4ff",
      red: "#ff4b4b", redDark: "#ea2b2b", yellow: "#ffc800", orange: "#ff9600", purple: "#ce82ff",
      gray: "#e5e5e5", gray2: "#afafaf", text: "#4b4b4b", okBg: "#d7ffb8", badBg: "#ffdfe0" } },
    fontFamily: { sans: ["var(--font-nunito)", "DIN Rounded", "sans-serif"] },
    animation: { pop: "pop .3s ease-out", shake: "shake .4s", slideUp: "slideUp .25s ease-out", bob: "bob 1s ease-in-out infinite" },
  } },
};
