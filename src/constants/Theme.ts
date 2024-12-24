export const theme = {
  colors: {
    primary: "#6277BF",
    secondary: "#0CC25F",
    primaryText: "#333333",
    secondaryText: "#858585",
    lightGray: "#F6F8FA",
    outline: "#CED1DD",
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
  },

  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
} as const;
