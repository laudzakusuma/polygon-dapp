import React, { useState, useEffect, useMemo } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { useNftTransfer } from '../../hooks/useNftTransfer';
import { Notification } from '../common/Notification';
import debounce from 'lodash.debounce';
// Impor gaya yang dibagikan
import { 
    FormContainer, FormGroup, Label, Input, Select, SubmitButton, 
    GasEstimateContainer, TransactionLink 
} from './FormStyles';

export const NftTransferForm: React.FC = () => {
    const { nfts, isLoading: isLoadingAssets } = useAssets();
    const { isSending, error, transactionHash, transferNft, resetState, isEstimating, gasEstimate, estimateGas } = useNftTransfer();

    const [selectedNft, setSelectedNft] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');

    const debouncedEstimate = useMemo(() => debounce(estimateGas, 500), [estimateGas]);

    useEffect(() => {
        if (nfts.length > 0 && !selectedNft) {
            setSelectedNft(`${nfts[0].contractAddress}-${nfts[0].tokenId}`);
        }
    }, [nfts, selectedNft]);

    useEffect(() => {
        if (selectedNft && recipient) {
            const [contractAddress, tokenId] = selectedNft.split('-');
            debouncedEstimate(contractAddress, recipient, tokenId);
        }
        return () => {
            debouncedEstimate.cancel();
        };
    }, [selectedNft, recipient, debouncedEstimate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const [contractAddress, tokenId] = selectedNft.split('-');
        transferNft(contractAddress, recipient, tokenId);
    };

    return (
        <FormContainer>
            {error && <Notification message={`Error: ${error}`} type="error" onClose={resetState} />}
            {transactionHash && <Notification message="Transaction Successful!" type="success" onClose={resetState} />}
            {transactionHash && (
                <p style={{ marginBottom: "16px", textAlign: 'center' }}>
                    <TransactionLink href={`https://amoy.polygonscan.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                        View on Amoy Scan
                    </TransactionLink>
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="nft">Select NFT</Label>
                    <Select id="nft" value={selectedNft} onChange={(e) => setSelectedNft(e.target.value)} disabled={isLoadingAssets || isSending}>
                        {isLoadingAssets ? (<option>Loading NFTs...</option>) :
                         nfts.length > 0 ? (
                            nfts.map((nft) => (
                                <option key={`${nft.contractAddress}-${nft.tokenId}`} value={`${nft.contractAddress}-${nft.tokenId}`}>
                                    {nft.name} (ID: {nft.tokenId.slice(0, 5)}...)
                                </option>
                            ))
                         ) : (<option>No NFTs found</option>)}
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" type="text" placeholder="0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} disabled={isSending} />
                </FormGroup>
                
                <GasEstimateContainer>
                    {isEstimating ? 'Estimating gas...' : gasEstimate ? `Est. Gas: ~${gasEstimate}` : ''}
                </GasEstimateContainer>
                
                <SubmitButton type="submit" disabled={isSending || !selectedNft || nfts.length === 0}>
                    {isSending ? 'Sending...' : 'Send NFT'}
                </SubmitButton>
            </form>
        </FormContainer>
    );
};