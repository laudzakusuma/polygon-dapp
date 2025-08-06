import { useState, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { sendNft as sendNftService } from '../services/tokenService';
import { ethers } from 'ethers';

export const useNftTransfer = () => {
    const context = useContext(WalletContext);
    const { signer } = context || {};

    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);

    const transferNft = async (contractAddress: string, recipient: string, tokenId: string) => {
        if (!signer) {
            setError("Wallet not connected or signer not available.");
            return;
        }
        if (!ethers.isAddress(recipient)) {
            setError("Invalid recipient address.");
            return;
        }
        if (!tokenId) {
            setError("No NFT selected.");
            return;
        }

        setIsSending(true);
        setError(null);
        setTransactionHash(null);

        try {
            const hash = await sendNftService(contractAddress, recipient, tokenId, signer);
            setTransactionHash(hash);
        } catch (err: any) {
            console.error("NFT transfer failed:", err);
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

    return { isSending, error, transactionHash, transferNft, resetState };
};