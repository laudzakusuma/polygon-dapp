import { useState, useContext, useCallback } from 'react'; // import useCallback
import { WalletContext } from '../contexts/WalletContext';
import { sendNft as sendNftService, estimateNftTransferGas } from '../services/tokenService';
import { ethers } from 'ethers';

export const useNftTransfer = () => {
    const context = useContext(WalletContext);
    const { signer } = context || {};

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    
    // State baru untuk estimasi gas
    const [isEstimating, setIsEstimating] = useState(false);
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);

    const transferNft = async (contractAddress: string, recipient: string, tokenId: string) => {
        // ... implementasi sama ...
    };

    const estimateGas = useCallback(async (contractAddress: string, recipient: string, tokenId: string) => {
        if (!signer || !ethers.isAddress(recipient) || !tokenId) {
            setGasEstimate(null);
            return;
        }

        setIsEstimating(true);
        setGasEstimate(null);
        try {
            const estimate = await estimateNftTransferGas(contractAddress, recipient, tokenId, signer);
            setGasEstimate(estimate);
        } catch (err) {
            console.error("Gas estimation failed:", err);
            setGasEstimate(null);
        } finally {
            setIsEstimating(false);
        }
    }, [signer]);

    const resetState = () => {
        setIsSending(false);
        setError(null);
        setTransactionHash(null);
        setGasEstimate(null);
    }

    return { isSending, error, transactionHash, transferNft, resetState, isEstimating, gasEstimate, estimateGas };
};