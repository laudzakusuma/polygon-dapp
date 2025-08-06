import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletContext } from '../contexts/WalletContext';
import { useAssets } from '../hooks/useAssets';
import { theme } from '../styles/theme';
import { SkeletonGrid } from '../components/common/SkeletonLoader';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: ${theme.spacing.large};
  background: -webkit-linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.onSurface};
  opacity: 0.9;
`;

const AssetGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: ${theme.glassmorphism.backgroundColor};
  border: 1px solid ${theme.glassmorphism.borderColor};
  border-radius: ${theme.borderRadius};
  padding: 1.25rem;
  box-shadow: 0 8px 32px 0 ${theme.colors.shadow};
  backdrop-filter: blur(${theme.glassmorphism.blur});
  position: relative;
  overflow: hidden;

  /* Efek Aurora Hover */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${theme.colors.glow}, transparent 40%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  &:hover::before {
    opacity: 0.3;
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const TokenCard = styled(Card)` text-align: center; `;
const TokenSymbol = styled.h3` font-size: 2rem; color: ${theme.colors.primary}; `;
const TokenName = styled.p` font-size: 0.9rem; color: #aaa; margin-bottom: 1rem; `;
const TokenBalance = styled.p` font-size: 1.5rem; font-weight: 700; `;

const NftCard = styled(Card)` display: flex; flex-direction: column; `;
const NftImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: ${theme.borderRadius};
    background-color: #000;
    margin-bottom: 1rem;
`;
const NftName = styled.h4` font-size: 1.1rem; font-weight: 700; `;
const NftCollection = styled.p` font-size: 0.8rem; color: #aaa; opacity: 0.8;`;

const EmptyStateCard = styled(Card)`
  grid-column: 1 / -1; /* Membentang selebar grid */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 1.5rem;
`;

const EmptyStateButton = styled.a`
  padding: 10px 20px;
  background: ${theme.colors.primary};
  color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px ${theme.colors.glow};
  }
`;

const EmptyState: React.FC<{ type: 'token' | 'nft' }> = ({ type }) => {
  const isToken = type === 'token';
  return (
    <EmptyStateCard>
      <EmptyStateIcon>{isToken ? '💰' : '🖼️'}</EmptyStateIcon>
      <EmptyStateText>
        {isToken ? "You don't have any testnet tokens yet." : "No NFTs found in your wallet."}
      </EmptyStateText>
      {isToken && (
        <EmptyStateButton href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer">
          Get Tokens from Faucet
        </EmptyStateButton>
      )}
    </EmptyStateCard>
  );
};


export const AssetsPage: React.FC = () => {
  const { isConnected } = useContext(WalletContext) || {};
  const { tokens, nfts, isLoading, error } = useAssets();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.querySelectorAll<HTMLElement>('[data-aurora-card]');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (!isConnected) return <PageContainer><Title>My Digital Assets</Title><EmptyStateText>Please connect your wallet to view your assets.</EmptyStateText></PageContainer>;
  if (error) return <PageContainer><Title>My Digital Assets</Title><EmptyStateText style={{ color: theme.colors.error }}>{error}</EmptyStateText></PageContainer>;
  if (isLoading) {
    return (
        <PageContainer>
            <Title>My Digital Assets</Title>
            <SectionTitle>ERC-20 Tokens</SectionTitle>
            <AssetGrid><SkeletonGrid count={3} type="token" /></AssetGrid>
            <SectionTitle>NFTs (ERC-721)</SectionTitle>
            <AssetGrid><SkeletonGrid count={3} type="nft" /></AssetGrid>
        </PageContainer>
    );
  }

  return (
    <PageContainer onMouseMove={handleMouseMove}>
      <Title>My Digital Assets</Title>
      
      <SectionTitle>ERC-20 Tokens</SectionTitle>
      <AssetGrid variants={containerVariants} initial="hidden" animate="visible">
        {tokens.length > 0 ? tokens.map((token) => (
          <TokenCard data-aurora-card variants={itemVariants} key={token.contractAddress} whileHover={{ y: -5 }}>
            <CardContent>
              <TokenSymbol>{token.symbol}</TokenSymbol>
              <TokenName>{token.name}</TokenName>
              <TokenBalance>{parseFloat(token.balance).toFixed(4)}</TokenBalance>
            </CardContent>
          </TokenCard>
        )) : <EmptyState type="token" />}
      </AssetGrid>
      
      <SectionTitle>NFTs (ERC-721)</SectionTitle>
      <AssetGrid variants={containerVariants} initial="hidden" animate="visible">
        {nfts.length > 0 ? nfts.map((nft) => (
          <NftCard data-aurora-card variants={itemVariants} key={`${nft.contractAddress}-${nft.tokenId}`} whileHover={{ y: -5 }}>
            <CardContent>
              <NftImage src={nft.image} alt={nft.name} onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/300x300/1e1e1e/FFF?text=Error'; }}/>
              <NftName>{nft.name}</NftName>
              <NftCollection>{nft.collectionName}</NftCollection>
            </CardContent>
          </NftCard>
        )) : <EmptyState type="nft" />}
      </AssetGrid>
    </PageContainer>
  );
};