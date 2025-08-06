import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: linear-gradient(135deg, #16102a 0%, #0a0a1a 100%);
    background-attachment: fixed;
    color: ${theme.colors.onSurface};
    font-family: ${theme.fonts.main};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    color: ${theme.colors.secondary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    &:hover {
      color: ${theme.colors.primary};
    }
  }
`;