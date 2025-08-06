import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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
  text-decoration: none;
  z-index: 10;

  span {
    background: -webkit-linear-gradient(45deg, ${(props) => props.theme.colors.primary}, ${(props) => props.theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Container baru untuk mengelompokkan item di sebelah kanan
const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Memberi jarak antar item di kanan */
`;

const Nav = styled.nav`
  display: flex;
  gap: ${(props) => props.theme.spacing.large};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.onSurface};
  padding-bottom: 4px;
  position: relative;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  text-decoration: none;

  &:hover { opacity: 1; }
  &.active {
    opacity: 1;
    color: ${(props) => props.theme.colors.primary};
  }
`;

const HamburgerButton = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: flex;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${(props) => props.theme.colors.onSurface};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
`;

const MobileNavContainer = styled(motion.div)`
  display: none;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${(props) => props.theme.colors.background};
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 5;
  }
`;

const MobileNavLink = styled(StyledNavLink)`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      <HeaderContainer
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Logo to="/"><span>Nexus</span> Hub</Logo>
        
        <RightContainer>
          <Nav>
            <StyledNavLink to="/">Home</StyledNavLink>
            <StyledNavLink to="/assets">My Assets</StyledNavLink>
            <StyledNavLink to="/interact">Interact</StyledNavLink>
            <StyledNavLink to="/history">History</StyledNavLink>
          </Nav>
          <ConnectWalletButton />
          <HamburgerButton onClick={() => setIsOpen(!isOpen)}>
            <div />
            <div />
            <div />
          </HamburgerButton>
        </RightContainer>

      </HeaderContainer>
      <AnimatePresence>
        {isOpen && (
          <MobileNavContainer
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <MobileNavLink to="/">Home</MobileNavLink>
            <MobileNavLink to="/assets">My Assets</MobileNavLink>
            <MobileNavLink to="/interact">Interact</MobileNavLink>
            <MobileNavLink to="/history">History</MobileNavLink>
          </MobileNavContainer>
        )}
      </AnimatePresence>
    </>
  );
};