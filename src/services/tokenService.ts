import { ethers } from 'ethers';

const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)"
];

// ABI ERC-721 diperbarui dengan fungsi transfer
const erc721Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)" // Ditambahkan
];

export interface Erc20Balance {
    contractAddress: string;
    name: string;
    symbol: string;
    balance: string;
}

export interface NftData {
    contractAddress: string;
    collectionName: string;
    tokenId: string;
    name: string;
    description: string;
    image: string;
}

const AMOY_TESTNET_ERC20_TOKENS = [
    { address: "0x41e94Eb019C0762f9BFC45459c8716f73e158404", symbol: "USDC" },
    { address: "0x65aFadd39029741B3b8f0756952C74678c9cEC93", symbol: "LINK" },
];

const AMOY_TESTNET_NFT_CONTRACTS = [
    "0x1A1535A476236b2B523456952A1d24B30471677A",
];

// Fungsi fetchTokenBalances dan fetchNfts tidak berubah
export const fetchTokenBalances = async (ownerAddress: string, provider: ethers.Provider): Promise<Erc20Balance[]> => {
    const balances: Erc20Balance[] = [];
    for (const token of AMOY_TESTNET_ERC20_TOKENS) {
        try {
            const contract = new ethers.Contract(token.address, erc20Abi, provider);
            const [name, symbol, balance, decimals] = await Promise.all([
                contract.name(),
                contract.symbol(),
                contract.balanceOf(ownerAddress),
                contract.decimals()
            ]);
            if (balance > 0) {
                balances.push({
                    contractAddress: token.address, name, symbol,
                    balance: ethers.formatUnits(balance, decimals),
                });
            }
        } catch (error) { console.error(`Failed to fetch balance for ${token.symbol}`, error); }
    }
    return balances;
};

export const fetchNfts = async (ownerAddress: string, provider: ethers.Provider): Promise<NftData[]> => {
    const nfts: NftData[] = [];
    for (const contractAddress of AMOY_TESTNET_NFT_CONTRACTS) {
        try {
            const contract = new ethers.Contract(contractAddress, erc721Abi, provider);
            const balance = await contract.balanceOf(ownerAddress);
            const collectionName = await contract.name();
            const limit = Math.min(Number(balance), 5);
            for (let i = 0; i < limit; i++) {
                try {
                    const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
                    let tokenUri = await contract.tokenURI(tokenId);
                    if (tokenUri.startsWith('ipfs://')) { tokenUri = `https://ipfs.io/ipfs/${tokenUri.split('ipfs://')[1]}`; }
                    const metadataResponse = await fetch(tokenUri);
                    if (!metadataResponse.ok) continue;
                    const metadata = await metadataResponse.json();
                    let imageUrl = metadata.image || metadata.image_url;
                    if (imageUrl && imageUrl.startsWith('ipfs://')) { imageUrl = `https://ipfs.io/ipfs/${imageUrl.split('ipfs://')[1]}`; }
                    nfts.push({
                        contractAddress, collectionName, tokenId: tokenId.toString(),
                        name: metadata.name || `Token #${tokenId}`,
                        description: metadata.description || 'No description',
                        image: imageUrl || 'https://placehold.co/300x300/1e1e1e/FFF?text=No+Image',
                    });
                } catch (e) { console.error(`Could not fetch metadata for a token in ${contractAddress}`, e); }
            }
        } catch (error) { console.error(`Failed to fetch NFTs from ${contractAddress}`, error); }
    }
    return nfts;
};

export const sendErc20Token = async (contractAddress: string, recipientAddress: string, amount: string, signer: ethers.JsonRpcSigner): Promise<string> => {
    const contract = new ethers.Contract(contractAddress, erc20Abi, signer);
    const decimals = await contract.decimals();
    const amountToSend = ethers.parseUnits(amount, decimals);
    const tx = await contract.transfer(recipientAddress, amountToSend);
    await tx.wait(1);
    return tx.hash;
};

/**
 * Mengirim NFT (ERC-721) ke alamat lain.
 * @param contractAddress Alamat kontrak NFT.
 * @param recipientAddress Alamat penerima.
 * @param tokenId ID dari token NFT yang akan dikirim.
 * @param signer Signer Ethers.js untuk menandatangani transaksi.
 * @returns Promise yang resolve ke hash transaksi.
 */
export const sendNft = async (
    contractAddress: string,
    recipientAddress: string,
    tokenId: string,
    signer: ethers.JsonRpcSigner
): Promise<string> => {
    const contract = new ethers.Contract(contractAddress, erc721Abi, signer);
    const ownerAddress = await signer.getAddress();

    console.log(`Sending NFT #${tokenId} from ${contractAddress} to ${recipientAddress}`);
    // Menggunakan 'safeTransferFrom(from, to, tokenId)'
    const tx = await contract.safeTransferFrom(ownerAddress, recipientAddress, tokenId);
    
    console.log("Transaction sent... waiting for confirmation.", tx.hash);
    await tx.wait(1); // Menunggu 1 konfirmasi

    console.log("Transaction confirmed!", tx.hash);
    return tx.hash;
};