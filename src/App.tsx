import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { AssetsPage } from './pages/AssetsPage';
import { InteractPage } from './pages/InteractPage';
import { HistoryPage } from './pages/HistoryPage';
import { GlobalStyle } from './styles/GlobalStyles';
import { WalletProvider } from './contexts/WalletContext';
import { ParticleBackground } from './components/common/ParticleBackground';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const PageWrapper = styled(motion.div)`
  flex-grow: 1;
`;

function App() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  return (
    <WalletProvider>
      <GlobalStyle />
      <ParticleBackground />
      <AppContainer>
        <Header />
        <AnimatePresence mode="wait">
          <PageWrapper
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/interact" element={<InteractPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </PageWrapper>
        </AnimatePresence>
      </AppContainer>
    </WalletProvider>
  );
}

export default App;