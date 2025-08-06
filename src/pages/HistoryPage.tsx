import React, { useContext } from 'react';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import { useTransactions } from '../hooks/useTransactions';
import { theme } from '../styles/theme';
import { TransactionList } from '../components/history/TransactionList';

const PageContainer = styled.div`
  padding: ${theme.spacing.large};
`;

const Title = styled.h1`
  font-size: 36px;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.large};
  text-align: center;
`;

const Message = styled.p`
    font-size: 18px;
    text-align: center;
`;

export const HistoryPage: React.FC = () => {
    const { isConnected } = useContext(WalletContext) || {};
    const { transactions, isLoading, error } = useTransactions();

    if (!isConnected) {
        return (
            <PageContainer>
                <Title>Transaction History</Title>
                <Message>Please connect your wallet to view your transaction history.</Message>
            </PageContainer>
        );
    }
    
    return (
        <PageContainer>
            <Title>Transaction History</Title>
            {isLoading && <Message>Loading history...</Message>}
            {error && <Message style={{ color: theme.colors.error }}>{error}</Message>}
            {!isLoading && !error && <TransactionList transactions={transactions} />}
        </PageContainer>
    );
};