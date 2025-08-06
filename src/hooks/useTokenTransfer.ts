import { useState, useContext, useCallback } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { sendErc20Token, estimateErc20TransferGas } from '../services/tokenService';
import { ethers } from 'ethers';

export const useTokenTransfer = () => {
    const context = useContext(WalletContext);
    const { signer } = context || {};

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    
    // State baru untuk estimasi gas
    const [isEstimating, setIsEstimating] = useState(false);
    const [gasEstimate, setGasEstimate] = useState<string | null>(null);

    const transferTokens = async (contractAddress: string, recipient: string, amount: string) => {
        // ... implementasi sama ...
    };

    const estimateGas = useCallback(async (contractAddress: string, recipient: string, amount: string) => {
        if (!signer || !ethers.isAddress(recipient) || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setGasEstimate(null);
            return;
        }

        setIsEstimating(true);
        setGasEstimate(null);
        try {
            const estimate = await estimateErc20TransferGas(contractAddress, recipient, amount, signer);
            setGasEstimate(estimate);
        } catch (err) {
            console.error("Gas estimation failed:", err);
            setGasEstimate(null); // Gagal estimasi, jangan tampilkan apa-apa
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

    return { isSending, error, transactionHash, transferTokens, resetState, isEstimating, gasEstimate, estimateGas };
};