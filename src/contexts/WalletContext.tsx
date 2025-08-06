import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  chainId: bigint | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAddress(accounts[0]);
    }
  }, []);

  const handleChainChanged = useCallback(() => {
    window.location.reload();
  }, []);

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    console.log("Wallet disconnected");
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const network = await browserProvider.getNetwork();
      const currentSigner = await browserProvider.getSigner();
      
      setProvider(browserProvider);
      setSigner(currentSigner);
      setAddress(accounts[0]);
      setChainId(network.chainId);

      console.log("Wallet connected:", accounts[0]);
      console.log("Network:", network.name, "(Chain ID:", network.chainId, ")");

    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please check the console for details.");
    }
  };
  
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const value = {
    provider,
    signer,
    address,
    chainId,
    isConnected: !!address,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};