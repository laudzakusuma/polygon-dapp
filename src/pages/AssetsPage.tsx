import React, { useContext } from 'react';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import { useAssets } from '../hooks/useAssets';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.large};
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  margin-top: ${theme.spacing.large};
  margin-bottom: ${theme.spacing.medium};
  border-bottom: 2px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.small};
`;

const Message = styled.p`
    font-size: 18px;
`;

const AssetGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${theme.spacing.large};
`;

const Card = styled.div`
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.medium};
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
`;

const TokenCard = styled(Card)`
    text-align: center;
`;

const TokenSymbol = styled.h3`
    font-size: 24px;
    color: ${theme.colors.primary};
`;

const TokenName = styled.p`
    font-size: 14px;
    color: #aaa;
    margin-bottom: ${theme.spacing.medium};
`;

const TokenBalance = styled.p`
    font-size: 20px;
    font-weight: bold;
`;

const NftCard = styled(Card)`
    display: flex;
    flex-direction: column;
`;

const NftImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: ${theme.borderRadius};
    background-color: #000;
`;

const NftName = styled.h4`
    margin-top: ${theme.spacing.medium};
    font-size: 18px;
`;

const NftCollection = styled.p`
    font-size: 14px;
    color: #aaa;
`;

export const AssetsPage: React.FC = () => {
  const { isConnected } = useContext(WalletContext) || {};
  const { tokens, nfts, isLoading, error } = useAssets();

  if (!isConnected) {
    return (
        <PageContainer>
            <Title>My Assets</Title>
            <Message>Please connect your wallet to view your assets.</Message>
        </PageContainer>
    );
  }

  if (isLoading) {
    return (
        <PageContainer>
            <Title>My Assets</Title>
            <Message>Loading your assets from the blockchain...</Message>
        </PageContainer>
    );
  }

  if (error) {
    return (
        <PageContainer>
            <Title>My Assets</Title>
            <Message style={{ color: theme.colors.error }}>{error}</Message>
        </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>My Digital Assets</Title>

      <SectionTitle>ERC-20 Tokens</SectionTitle>
      {tokens.length > 0 ? (
        <AssetGrid>
          {tokens.map((token) => (
            <TokenCard key={token.contractAddress}>
              <TokenSymbol>{token.symbol}</TokenSymbol>
              <TokenName>{token.name}</TokenName>
              <TokenBalance>{parseFloat(token.balance).toFixed(4)}</TokenBalance>
            </TokenCard>
          ))}
        </AssetGrid>
      ) : (
        <Message>No ERC-20 tokens found in this wallet.</Message>
      )}

      <SectionTitle>NFTs (ERC-721)</SectionTitle>
      {nfts.length > 0 ? (
        <AssetGrid>
          {nfts.map((nft) => (
            <NftCard key={`${nft.contractAddress}-${nft.tokenId}`}>
              <NftImage src={nft.image} alt={nft.name} onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src='https://placehold.co/300x300/1e1e1e/FFF?text=Error';
              }}/>
              <NftName>{nft.name}</NftName>
              <NftCollection>{nft.collectionName}</NftCollection>
            </NftCard>
          ))}
        </AssetGrid>
      ) : (
        <Message>No NFTs found in this wallet.</Message>
      )}
    </PageContainer>
  );
};