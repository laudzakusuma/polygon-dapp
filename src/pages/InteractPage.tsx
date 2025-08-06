import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import { theme } from '../styles/theme';
import { TokenTransferForm } from '../components/forms/TokenTransferForm';
import { NftTransferForm } from '../components/forms/NftTransferForm';

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

const TabContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: ${theme.spacing.large};
    border-bottom: 2px solid ${theme.colors.border};
`;

const TabButton = styled.button<{ isActive: boolean }>`
    padding: 10px 20px;
    font-size: 18px;
    background: none;
    border: none;
    color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.onSurface)};
    cursor: pointer;
    position: relative;
    
    &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${(props) => (props.isActive ? props.theme.colors.primary : 'transparent')};
        transition: background-color 0.2s ease;
    }
`;

type Tab = 'token' | 'nft';

export const InteractPage: React.FC = () => {
  const context = useContext(WalletContext);
  const [activeTab, setActiveTab] = useState<Tab>('token');

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
      <Title>Send Assets</Title>
      <TabContainer>
        <TabButton isActive={activeTab === 'token'} onClick={() => setActiveTab('token')}>
            ERC-20 Token
        </TabButton>
        <TabButton isActive={activeTab === 'nft'} onClick={() => setActiveTab('nft')}>
            NFT (ERC-721)
        </TabButton>
      </TabContainer>
      
      {activeTab === 'token' && <TokenTransferForm />}
      {activeTab === 'nft' && <NftTransferForm />}

    </PageContainer>
  );
};