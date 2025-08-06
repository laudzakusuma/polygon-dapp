import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletContext } from '../contexts/WalletContext';
import { useAssets } from '../hooks/useAssets';
import { theme } from '../styles/theme';
import { SkeletonGrid } from '../components/common/SkeletonLoader';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
`;
const Title = styled.h1`
  font-size: 36px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
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
  text-align: center;
`;
const AssetGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${theme.spacing.large};
`;
const Card = styled(motion.div)`
    background: ${theme.glassmorphism.backgroundColor};
    backdrop-filter: blur(${theme.glassmorphism.blur});
    border: 1px solid ${theme.glassmorphism.borderColor};
    border-radius: ${theme.borderRadius};
    padding: ${theme.spacing.medium};
    box-shadow: 0 4px 30px ${theme.colors.shadow};
    overflow: hidden;
`;
const TokenCard = styled(Card)` text-align: center; `;
const TokenSymbol = styled.h3` font-size: 24px; color: ${theme.colors.primary}; `;
const TokenName = styled.p` font-size: 14px; color: #aaa; margin-bottom: ${theme.spacing.medium}; `;
const TokenBalance = styled.p` font-size: 20px; font-weight: bold; `;
const NftCard = styled(Card)` display: flex; flex-direction: column; `;
const NftImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: ${theme.borderRadius};
    background-color: #000;
`;
const NftName = styled.h4` margin-top: ${theme.spacing.medium}; font-size: 18px; `;
const NftCollection = styled.p` font-size: 14px; color: #aaa; `;

export const AssetsPage: React.FC = () => {
  const { isConnected } = useContext(WalletContext) || {};
  const { tokens, nfts, isLoading, error } = useAssets();
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (!isConnected) return <PageContainer><Title>My Assets</Title><Message>Please connect your wallet.</Message></PageContainer>;
  if (error) return <PageContainer><Title>My Assets</Title><Message style={{ color: theme.colors.error }}>{error}</Message></PageContainer>;
  if (isLoading) {
    return (
        <PageContainer>
            <Title>My Assets</Title>
            <SectionTitle>ERC-20 Tokens</SectionTitle>
            <AssetGrid><SkeletonGrid count={3} type="token" /></AssetGrid>
            <SectionTitle>NFTs (ERC-721)</SectionTitle>
            <AssetGrid><SkeletonGrid count={3} type="nft" /></AssetGrid>
        </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Title>My Digital Assets</Title>
      <SectionTitle>ERC-20 Tokens</SectionTitle>
      <AssetGrid variants={containerVariants} initial="hidden" animate="visible">
        {tokens.length > 0 ? tokens.map((token) => (
          <TokenCard variants={itemVariants} key={token.contractAddress} whileHover={{ y: -5 }}>
            <TokenSymbol>{token.symbol}</TokenSymbol>
            <TokenName>{token.name}</TokenName>
            <TokenBalance>{parseFloat(token.balance).toFixed(4)}</TokenBalance>
          </TokenCard>
        )) : <Message>No ERC-20 tokens found.</Message>}
      </AssetGrid>
      <SectionTitle>NFTs (ERC-721)</SectionTitle>
      <AssetGrid variants={containerVariants} initial="hidden" animate="visible">
        {nfts.length > 0 ? nfts.map((nft) => (
          <NftCard variants={itemVariants} key={`${nft.contractAddress}-${nft.tokenId}`} whileHover={{ y: -5 }}>
            <NftImage src={nft.image} alt={nft.name} onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/300x300/1e1e1e/FFF?text=Error'; }}/>
            <NftName>{nft.name}</NftName>
            <NftCollection>{nft.collectionName}</NftCollection>
          </NftCard>
        )) : <Message>No NFTs found.</Message>}
      </AssetGrid>
    </PageContainer>
  );
};