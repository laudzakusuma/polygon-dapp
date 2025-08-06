import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.medium};
`;

const Subtitle = styled.p`
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

export const HomePage: React.FC = () => {
  return (
    <PageContainer>
      <Title>Welcome to Your Web3 DApp</Title>
      <Subtitle>
        This is your portal to the decentralized world on the Polygon network.
        Connect your wallet to get started.
      </Subtitle>
    </PageContainer>
  );
};