import React, { useContext } from 'react';
import styled from 'styled-components';
import { WalletContext } from '../../contexts/WalletContext';
import { shortenAddress } from '../../utils/helpers';
import { theme } from '../../styles/theme';

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary};
  border: none;
  padding: 10px 20px;
  border-radius: ${theme.borderRadius};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.1s ease;

  &:hover {
    background-color: ${theme.colors.primaryVariant};
  }
  
  &:active {
      transform: scale(0.98);
  }
`;

const DisconnectButton = styled(Button)`
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

  if (!context) {
    throw new Error('ConnectWalletButton must be used within a WalletProvider');
  }

  const { isConnected, address, connectWallet, disconnectWallet } = context;

  if (isConnected && address) {
    return (
      <DisconnectButton onClick={disconnectWallet}>
        Disconnect ({shortenAddress(address)})
      </DisconnectButton>
    );
  }

  return <Button onClick={connectWallet}>Connect Wallet</Button>;
};