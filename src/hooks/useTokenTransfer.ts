import { useState, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { sendErc20Token } from '../services/tokenService';
import { ethers } from 'ethers';

export const useTokenTransfer = () => {
    const context = useContext(WalletContext);
    const { signer } = context || {};

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const transferTokens = async (contractAddress: string, recipient: string, amount: string) => {
        if (!signer) {
            setError("Wallet not connected or signer not available.");
            return;
        }
        if (!ethers.isAddress(recipient)) {
            setError("Invalid recipient address.");
            return;
        }
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setError("Invalid amount.");
            return;
        }

        setIsSending(true);
        setError(null);
        setTransactionHash(null);

        try {
            const hash = await sendErc20Token(contractAddress, recipient, amount, signer);
            setTransactionHash(hash);
        } catch (err: any) {
            console.error("Token transfer failed:", err);
            setError(err.reason || "Transaction failed. Check console for details.");
        } finally {
            setIsSending(false);
        }
    };

    const resetState = () => {
        setIsSending(false);
        setError(null);
        setTransactionHash(null);
    }

    return { isSending, error, transactionHash, transferTokens, resetState };
};