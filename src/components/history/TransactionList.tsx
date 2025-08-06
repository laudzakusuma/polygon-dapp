import React from 'react';
import styled from 'styled-components';
import { Transaction } from '../../services/transactionService';
import { theme } from '../../styles/theme';
import { shortenAddress, formatTimestamp } from '../../utils/helpers';
import { ethers } from 'ethers';

const ListContainer = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

const TxRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${theme.spacing.medium};
    padding: ${theme.spacing.medium};
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius};
    margin-bottom: ${theme.spacing.medium};
    align-items: center;
    border: 1px solid ${theme.colors.border};
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #2a2a2a;
    }
`;

const TxColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

const TxLabel = styled.span`
    font-size: 12px;
    color: #aaa;
    margin-bottom: 4px;
`;

const TxValue = styled.span`
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
`;

const TxLink = styled.a`
    color: ${theme.colors.secondary};
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

interface TransactionListProps {
    transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    if (transactions.length === 0) {
        return <p style={{textAlign: 'center'}}>No transactions found.</p>;
    }

    return (
        <ListContainer>
            {transactions.map(tx => (
                <TxLink key={tx.hash} href={`https://amoy.polygonscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                    <TxRow>
                        <TxColumn>
                            <TxLabel>To</TxLabel>
                            <TxValue>{shortenAddress(tx.to)}</TxValue>
                        </TxColumn>
                        <TxColumn>
                            <TxLabel>Value</TxLabel>
                            <TxValue>{parseFloat(ethers.formatEther(tx.value)).toFixed(5)} MATIC</TxValue>
                        </TxColumn>
                        <TxColumn>
                            <TxLabel>Date</TxLabel>
                            <TxValue>{formatTimestamp(tx.timeStamp)}</TxValue>
                        </TxColumn>
                    </TxRow>
                </TxLink>
            ))}
        </ListContainer>
    );
};