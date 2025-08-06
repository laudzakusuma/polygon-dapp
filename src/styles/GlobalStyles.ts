import { createGlobalStyle, keyframes } from 'styled-components'; // Impor keyframes di sini
import { theme } from './theme';

const particles = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-1000px); }
`;

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.onSurface};
    font-family: ${theme.fonts.main};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* ... sisa implementasi sama ... */
  .particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    overflow: hidden;
  }
  .particle {
    position: absolute;
    background: white;
    border-radius: 50%;
    animation: ${particles} 25s linear infinite;
  }
`;