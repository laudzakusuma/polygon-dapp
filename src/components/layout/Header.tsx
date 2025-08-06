import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectWalletButton } from '../common/ConnectWalletButton';
import { theme } from '../../styles/theme';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.medium} ${theme.spacing.large};
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.onSurface};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.large};
`;

const StyledNavLink = styled(NavLink)`
  font-size: 18px;
  color: ${theme.colors.onSurface};
  padding-bottom: 4px;
  position: relative;

  &.active {
    color: ${theme.colors.primary};
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: ${theme.colors.primary};
    }
  }
`;

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">PolygonDApp</Logo>
      <Nav>
        <StyledNavLink to="/">Home</StyledNavLink>
        <StyledNavLink to="/assets">My Assets</StyledNavLink>
        <StyledNavLink to="/interact">Interact</StyledNavLink>
        <StyledNavLink to="/history">History</StyledNavLink> {/* DITAMBAHKAN */}
      </Nav>
      <ConnectWalletButton />
    </HeaderContainer>
  );
};