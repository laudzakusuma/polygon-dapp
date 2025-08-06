import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AssetsPage } from './pages/AssetsPage';
import { InteractPage } from './pages/InteractPage';
import { GlobalStyle } from './styles/GlobalStyles';
import { WalletProvider } from './contexts/WalletContext';
import { theme } from './styles/theme';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: ${theme.spacing.large};
`;

function App() {
  return (
    <WalletProvider>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/interact" element={<InteractPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </WalletProvider>
  );
}

export default App;