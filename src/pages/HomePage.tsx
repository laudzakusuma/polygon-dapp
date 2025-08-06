import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import { ConnectWalletButton } from '../components/common/ConnectWalletButton'; // Impor tombol

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: ${theme.spacing.large};
`;

const Title = styled(motion.h1)`
  font-size: 5rem;
  font-weight: 700;
  background: -webkit-linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${theme.spacing.medium};
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  max-width: 600px;
  opacity: 0.8;
  margin-bottom: ${theme.spacing.large};
`;

export const HomePage: React.FC = () => {
  return (
    <PageContainer>
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        Manage Your Digital Universe.
      </Title>
      <Subtitle
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
      >
        A secure, scalable, and beautiful interface for your assets on the Polygon network.
      </Subtitle>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4, type: 'spring' }}
      >
        <ConnectWalletButton />
      </motion.div>
    </PageContainer>
  );
};