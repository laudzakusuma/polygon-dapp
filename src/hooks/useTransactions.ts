import { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { Transaction, fetchTransactions } from '../services/transactionService';

export const useTransactions = () => {
    const context = useContext(WalletContext);
    const { address, isConnected } = context || {};

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransactions = async () => {
            if (isConnected && address) {
                setIsLoading(true);
                setError(null);
                try {
                    const txData = await fetchTransactions(address);
                    setTransactions(txData);
                } catch (err) {
                    setError("Failed to load transaction history.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTransactions([]);
            }
        };

        loadTransactions();
    }, [address, isConnected]);

    return { transactions, isLoading, error };
};