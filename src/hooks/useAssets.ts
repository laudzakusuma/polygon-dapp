import { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { Erc20Balance, NftData, fetchTokenBalances, fetchNfts } from '../services/tokenService';

export const useAssets = () => {
    const context = useContext(WalletContext);
    const { provider, address } = context || {};

    const [tokens, setTokens] = useState<Erc20Balance[]>([]);
    const [nfts, setNfts] = useState<NftData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAssets = async () => {
            if (provider && address) {
                setIsLoading(true);
                setError(null);
                try {
                    const [tokenData, nftData] = await Promise.all([
                        fetchTokenBalances(address, provider),
                        fetchNfts(address, provider)
                    ]);
                    setTokens(tokenData);
                    setNfts(nftData);
                } catch (err) {
                    console.error("Error loading assets:", err);
                    setError("Failed to load assets. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTokens([]);
                setNfts([]);
            }
        };

        loadAssets();
    }, [provider, address]);

    return { tokens, nfts, isLoading, error };
};