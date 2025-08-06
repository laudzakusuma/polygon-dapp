import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAssets } from '../../hooks/useAssets';
import { useNftTransfer } from '../../hooks/useNftTransfer';
import { theme } from '../../styles/theme';
import { Notification } from '../common/Notification';

const FormContainer = styled.div`
  background-color: ${theme.colors.surface};
  padding: ${theme.spacing.large};
  border-radius: ${theme.borderRadius};
  border: 1px solid ${theme.colors.border};
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div` margin-bottom: ${theme.spacing.medium}; `;
const Label = styled.label` display: block; margin-bottom: ${theme.spacing.small}; font-weight: 500; `;
const Input = styled.input`
  width: 100%; padding: 12px; background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border}; border-radius: ${theme.borderRadius};
  color: ${theme.colors.onSurface}; font-size: 16px;
  &:focus { outline: none; border-color: ${theme.colors.primary}; }
`;
const Select = styled(Input).attrs({ as: 'select' })``;
const SubmitButton = styled.button`
  width: 100%; padding: 12px; background-color: ${theme.colors.primary};
  color: ${theme.colors.onPrimary}; border: none; border-radius: ${theme.borderRadius};
  font-size: 18px; font-weight: 600; cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover:not(:disabled) { background-color: ${theme.colors.primaryVariant}; }
  &:disabled { background-color: #555; cursor: not-allowed; }
`;
const TransactionLink = styled.a` color: ${theme.colors.secondary}; text-decoration: underline; font-weight: bold; `;

export const NftTransferForm: React.FC = () => {
    const { nfts, isLoading: isLoadingAssets } = useAssets();
    const { isSending, error, transactionHash, transferNft, resetState } = useNftTransfer();

    const [selectedNft, setSelectedNft] = useState<string>(''); // Format: "contractAddress-tokenId"
    const [recipient, setRecipient] = useState<string>('');

    useEffect(() => {
        if (nfts.length > 0 && !selectedNft) {
            setSelectedNft(`${nfts[0].contractAddress}-${nfts[0].tokenId}`);
        }
    }, [nfts, selectedNft]);

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
                <p style={{ marginBottom: theme.spacing.medium, textAlign: 'center' }}>
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

                <SubmitButton type="submit" disabled={isSending || !selectedNft || nfts.length === 0}>
                    {isSending ? 'Sending...' : 'Send NFT'}
                </SubmitButton>
            </form>
        </FormContainer>
    );
};