import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../styles/theme';
import { ConnectWalletButton } from '../components/common/ConnectWalletButton';
import { WalletContext } from '../contexts/WalletContext';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 85vh;
  text-align: center;
  padding: ${theme.spacing.large};
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  background: -webkit-linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${theme.spacing.medium};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  max-width: 650px;
  opacity: 0.8;
  margin-bottom: 2.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const FeaturesContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeatureCard = styled.div`
  background: ${theme.glassmorphism.backgroundColor};
  border: 1px solid ${theme.glassmorphism.borderColor};
  border-radius: ${theme.borderRadius};
  padding: 1.5rem;
  width: 280px;
  text-align: left;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.onSurface};
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  opacity: 0.7;
`;

export const HomePage: React.FC = () => {
  const { isConnected } = useContext(WalletContext) || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PageContainer>
      <Title
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
      >
        Welcome to Nexus Hub
      </Title>
      <Subtitle
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
      >
        The ultimate gateway to manage your digital assets on the Polygon network. Secure, intuitive, and beautifully designed for the modern web.
      </Subtitle>

      {!isConnected && (
        <>
          <FeaturesContainer variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <FeatureCard>
                <FeatureTitle>Asset Dashboard</FeatureTitle>
                <FeatureDescription>View all your ERC-20 tokens and NFTs in one clean, beautiful interface.</FeatureDescription>
              </FeatureCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard>
                <FeatureTitle>Seamless Transactions</FeatureTitle>
                <FeatureDescription>Securely send assets with real-time gas fee estimations. Full control, zero guesswork.</FeatureDescription>
              </FeatureCard>
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard>
                <FeatureTitle>Full History</FeatureTitle>
                <FeatureDescription>Review your entire transaction history, fetched directly from the blockchain for transparency.</FeatureDescription>
              </FeatureCard>
            </motion.div>
          </FeaturesContainer>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1, type: 'spring' }}
          >
            <ConnectWalletButton />
          </motion.div>
        </>
      )}
    </PageContainer>
  );
};