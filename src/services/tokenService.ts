import { ethers } from 'ethers';

// ABI (Application Binary Interface) minimal untuk fungsi yang kita butuhkan.
const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)" // Ditambahkan untuk transfer
];

const erc721Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
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

const POLYGON_ERC20_TOKENS = [
    { address: "0x0dfB894B70Da5BC231a38A79Ddf6a63C6DAA3903", symbol: "WMATIC" },
    { address: "0x2751546ce00EdB94d68F230EEcd4075321189319", symbol: "USDC" },
    { address: "0x8f3A5Fe8F2501ab9b50e4fEbD8D4eC10A94f904e", symbol: "DAI" },
];

const POLYGON_NFT_CONTRACTS = [
    "0x29c00FEd9ab2d88cA1b5aC5920589698b26b1cE3",
];

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
                    if (tokenUri.startsWith('ipfs://')) {
                        tokenUri = `https://ipfs.io/ipfs/${tokenUri.split('ipfs://')[1]}`;
                    }
                    
                    const metadataResponse = await fetch(tokenUri);
                    if (!metadataResponse.ok) continue;

                    const metadata = await metadataResponse.json();
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

/**
 * Mengirim token ERC-20 ke alamat lain.
 * @param contractAddress Alamat kontrak token.
 * @param recipientAddress Alamat penerima.
 * @param amount Jumlah yang akan dikirim (dalam format string, mis. "1.5").
 * @param signer Signer Ethers.js untuk menandatangani transaksi.
 * @returns Promise yang resolve ke hash transaksi.
 */
export const sendErc20Token = async (
    contractAddress: string,
    recipientAddress: string,
    amount: string,
    signer: ethers.JsonRpcSigner
): Promise<string> => {
    const contract = new ethers.Contract(contractAddress, erc20Abi, signer);
    const decimals = await contract.decimals();
    const amountToSend = ethers.parseUnits(amount, decimals);

    console.log(`Sending ${amount} tokens from ${contractAddress} to ${recipientAddress}`);
    const tx = await contract.transfer(recipientAddress, amountToSend);
    
    console.log("Transaction sent... waiting for confirmation.", tx.hash);
    await tx.wait(1); // Menunggu 1 konfirmasi

    console.log("Transaction confirmed!", tx.hash);
    return tx.hash;
};