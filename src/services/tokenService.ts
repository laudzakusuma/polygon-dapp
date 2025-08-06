import { ethers } from 'ethers';

// ABI (Application Binary Interface) minimal untuk fungsi yang kita butuhkan.
const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

const erc721Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
];

// Tipe data untuk hasil yang kita proses
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

// Daftar token ERC-20 umum di Polygon untuk dideteksi
const POLYGON_ERC20_TOKENS = [
    { address: "0x0dfB894B70Da5BC231a38A79Ddf6a63C6DAA3903", symbol: "WMATIC" }, // Wrapped Matic
    { address: "0x2751546ce00EdB94d68F230EEcd4075321189319", symbol: "USDC" },   // USDC
    { address: "0x8f3A5Fe8F2501ab9b50e4fEbD8D4eC10A94f904e", symbol: "DAI" },    // DAI
];

// Contoh kontrak NFT di Polygon untuk dideteksi
const POLYGON_NFT_CONTRACTS = [
    "0x29c00FEd9ab2d88cA1b5aC5920589698b26b1cE3", // OpenSea Shared Storefront
];


/**
 * Mengambil saldo token ERC-20 untuk sebuah alamat.
 * @param ownerAddress Alamat pemilik dompet.
 * @param provider Provider Ethers.js.
 * @returns Promise yang resolve ke array Erc20Balance.
 */
export const fetchTokenBalances = async (ownerAddress: string, provider: ethers.Provider): Promise<Erc20Balance[]> => {
    const balances: Erc20Balance[] = [];
    for (const token of POLYGON_ERC20_TOKENS) {
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
                    contractAddress: token.address,
                    name,
                    symbol,
                    balance: ethers.formatUnits(balance, decimals),
                });
            }
        } catch (error) {
            console.error(`Failed to fetch balance for ${token.symbol} at ${token.address}`, error);
        }
    }
    return balances;
};

/**
 * Mengambil NFT (ERC-721) yang dimiliki oleh sebuah alamat.
 * @param ownerAddress Alamat pemilik dompet.
 * @param provider Provider Ethers.js.
 * @returns Promise yang resolve ke array NftData.
 */
export const fetchNfts = async (ownerAddress: string, provider: ethers.Provider): Promise<NftData[]> => {
    const nfts: NftData[] = [];
    for (const contractAddress of POLYGON_NFT_CONTRACTS) {
        try {
            const contract = new ethers.Contract(contractAddress, erc721Abi, provider);
            const balance = await contract.balanceOf(ownerAddress);
            const collectionName = await contract.name();
            const limit = Math.min(Number(balance), 5); 

            for (let i = 0; i < limit; i++) {
                try {
                    const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);
                    let tokenUri = await contract.tokenURI(tokenId);

                    // Handle IPFS URLs
                    if (tokenUri.startsWith('ipfs://')) {
                        tokenUri = `https://ipfs.io/ipfs/${tokenUri.split('ipfs://')[1]}`;
                    }
                    
                    // Fetch metadata
                    const metadataResponse = await fetch(tokenUri);
                    if (!metadataResponse.ok) continue;

                    const metadata = await metadataResponse.json();
                    
                    // Handle IPFS image URLs in metadata
                    let imageUrl = metadata.image || metadata.image_url;
                     if (imageUrl && imageUrl.startsWith('ipfs://')) {
                        imageUrl = `https://ipfs.io/ipfs/${imageUrl.split('ipfs://')[1]}`;
                    }

                    nfts.push({
                        contractAddress,
                        collectionName,
                        tokenId: tokenId.toString(),
                        name: metadata.name || `Token #${tokenId}`,
                        description: metadata.description || 'No description',
                        image: imageUrl || 'https://placehold.co/300x300/1e1e1e/FFF?text=No+Image',
                    });
                } catch (e) {
                    console.error(`Could not fetch metadata for a token in ${contractAddress}`, e);
                }
            }
        } catch (error) {
            console.error(`Failed to fetch NFTs from ${contractAddress}`, error);
        }
    }
    return nfts;
};