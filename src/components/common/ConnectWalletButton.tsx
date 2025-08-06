import React, { useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletContext } from '../../contexts/WalletContext';
import { shortenAddress } from '../../utils/helpers';
import { theme } from '../../styles/theme';

const ButtonBase = styled(motion.button)`
  border: none;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
`;

const Button = styled(ButtonBase)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
`;

const DisconnectButton = styled(ButtonBase)`
    background-color: ${theme.colors.surface};
    color: ${theme.colors.onSurface};
    border: 1px solid ${theme.colors.border};

    &:hover {
        background-color: ${theme.colors.error};
        color: ${theme.colors.onPrimary};
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