import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ConnectWalletButton } from '../common/ConnectWalletButton';

const HeaderContainer = styled(motion.header)`
  position: sticky;
  top: 16px;
  margin: 0 16px;
  z-index: 10;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.medium} ${(props) => props.theme.spacing.large};
  
  background: ${(props) => props.theme.glassmorphism.backgroundColor};
  backdrop-filter: blur(${(props) => props.theme.glassmorphism.blur});
  border: 1px solid ${(props) => props.theme.glassmorphism.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.onSurface};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${(props) => props.theme.spacing.large};
`;

const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.onSurface};
  padding-bottom: 4px;
  position: relative;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const Header: React.FC = () => {
  return (
    <HeaderContainer
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Logo to="/">PolygonDApp</Logo>
      <Nav>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/assets">My Assets</StyledNavLink>
        <StyledNavLink to="/interact">Interact</StyledNavLink>
        <StyledNavLink to="/history">History</StyledNavLink>
      </Nav>
      <ConnectWalletButton />
    </HeaderContainer>
  );
};