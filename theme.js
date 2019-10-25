const lightGray = "#ebeef2";
const black = "black";
// const primary = "rgb(57, 105, 186)";
const primary = "#0070f3";

const defaultTheme = {
  breakpoints: ['40em', '52em', '64em'],
  colors: {
    white: '#fff',
    gray: '#bbb',
    black: '#222',
    purple: '#11144C',
    red: '#E16262',
    green: '#3A9679',
    yellow: '#FABC60'
  },
  fonts: {
    default: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;'
  },
  fontSizes: [16, 20, 24, 32, 48, 64],
  space: [
    0, 4, 8, 16, 32, 64, 128, 256
  ]
};

const lightMode = {
  primary: primary,
  background: "white",
  backgroundAlt: lightGray,
  body: "black",
  inputBorder: "#eaeaea",
  ...defaultTheme
}

const darkMode = {
  primary: primary,
  background: "black",
  backgroundAlt: "#111111",
  body: "white",
  inputBorder: "#333333",
  ...defaultTheme
};

export {
  lightMode,
  darkMode
}