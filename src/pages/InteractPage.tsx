import React, { useContext } from 'react';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import { theme } from '../styles/theme';
import { TokenTransferForm } from '../components/forms/TokenTransferForm';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
`;

const Message = styled.p`
    font-size: 18px;
    text-align: center;
`;

export const InteractPage: React.FC = () => {
  const context = useContext(WalletContext);

  if (!context?.isConnected) {
    return (
        <PageContainer>
            <Title>Interact with Contracts</Title>
            <Message>Please connect your wallet to interact with smart contracts.</Message>
        </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Title>Send ERC-20 Tokens</Title>
      <TokenTransferForm />
    </PageContainer>
  );
};