import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletContext } from '../../contexts/WalletContext';
import { shortenAddress } from '../../utils/helpers';
import { theme } from '../../styles/theme';

const ButtonBase = styled(motion.button)`
  border: 1px solid transparent;
  padding: 12px 24px;
  border-radius: ${theme.borderRadius};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
`;

const Button = styled(ButtonBase)`
  background: linear-gradient(90deg, ${theme.colors.primary}, #c392ff);
  color: ${theme.colors.background};
  box-shadow: 0 0 20px ${theme.colors.glow};

  &:hover {
    box-shadow: 0 0 30px ${theme.colors.glow};
  }
`;

const DisconnectButton = styled(ButtonBase)`
    background-color: ${theme.glassmorphism.backgroundColor};
    color: ${theme.colors.onSurface};
    border: 1px solid ${theme.colors.border};

    &:hover {
        border-color: ${theme.colors.error};
        color: ${theme.colors.error};
    }
`;

export const ConnectWalletButton: React.FC = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('ConnectWalletButton must be used within a WalletProvider');
  const { isConnected, address, connectWallet, disconnectWallet } = context;

  if (isConnected && address) {
    return (
      <DisconnectButton 
        onClick={disconnectWallet}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        Disconnect ({shortenAddress(address)})
      </DisconnectButton>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      Connect Wallet
    </Button>
  );
};