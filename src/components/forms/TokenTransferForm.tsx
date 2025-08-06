import React, { useState, useEffect, useMemo } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { useTokenTransfer } from '../../hooks/useTokenTransfer';
import { Notification } from '../common/Notification';
import debounce from 'lodash.debounce';
// Impor gaya yang dibagikan
import { 
    FormContainer, FormGroup, Label, Input, Select, SubmitButton, 
    GasEstimateContainer, TransactionLink 
} from './FormStyles';

export const TokenTransferForm: React.FC = () => {
    const { tokens, isLoading: isLoadingAssets } = useAssets();
    const { isSending, error, transactionHash, transferTokens, resetState, isEstimating, gasEstimate, estimateGas } = useTokenTransfer();

    const [selectedToken, setSelectedToken] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');

    const debouncedEstimate = useMemo(() => debounce(estimateGas, 500), [estimateGas]);

    useEffect(() => {
        if (tokens.length > 0 && !selectedToken) {
            setSelectedToken(tokens[0].contractAddress);
        }
    }, [tokens, selectedToken]);

    useEffect(() => {
        if (selectedToken && recipient && amount) {
            debouncedEstimate(selectedToken, recipient, amount);
        }
        return () => {
            debouncedEstimate.cancel();
        };
    }, [selectedToken, recipient, amount, debouncedEstimate]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transferTokens(selectedToken, recipient, amount);
    };
    
    const selectedTokenData = tokens.find(t => t.contractAddress === selectedToken);

    return (
        <FormContainer>
            {error && <Notification message={`Error: ${error}`} type="error" onClose={resetState} />}
            {transactionHash && <Notification message="Transaction Successful!" type="success" onClose={resetState} />}
            {transactionHash && (
                <p style={{marginBottom: "16px", textAlign: 'center'}}>
                    <TransactionLink href={`https://amoy.polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        View on Amoy Scan
                    </TransactionLink>
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="token">Select Token</Label>
                    <Select id="token" value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} disabled={isLoadingAssets || isSending}>
                        {isLoadingAssets ? ( <option>Loading tokens...</option> ) : 
                         tokens.length > 0 ? (
                            tokens.map((token) => (
                                <option key={token.contractAddress} value={token.contractAddress}>
                                    {token.symbol} (Balance: {parseFloat(token.balance).toFixed(4)})
                                </option>
                            ))
                         ) : ( <option>No tokens found</option> )
                        }
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" type="text" placeholder="0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} disabled={isSending} />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="text" placeholder={`e.g., 1.25 ${selectedTokenData?.symbol || ''}`} value={amount} onChange={(e) => setAmount(e.target.value)} disabled={isSending} />
                </FormGroup>
                
                <GasEstimateContainer>
                    {isEstimating ? 'Estimating gas...' : gasEstimate ? `Est. Gas: ~${gasEstimate}` : ''}
                </GasEstimateContainer>
                
                <SubmitButton type="submit" disabled={isSending || !selectedToken || tokens.length === 0}>
                    {isSending ? 'Sending...' : 'Send Token'}
                </SubmitButton>
            </form>
        </FormContainer>
    );
};