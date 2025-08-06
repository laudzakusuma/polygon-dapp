import { ethers } from 'ethers';

// Definisi ABI tidak berubah
const erc20Abi = [
    "function name() view returns (string)", "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)",
    "function transfer(address to, uint amount) returns (bool)"
];
const erc721Abi = [
    "function name() view returns (string)", "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)"
];

// Definisi interface dan konstanta tidak berubah
export interface Erc20Balance { contractAddress: string; name: string; symbol: string; balance: string; }
export interface NftData { contractAddress: string; collectionName: string; tokenId: string; name: string; description: string; image: string; }
const AMOY_TESTNET_ERC20_TOKENS = [
    { address: "0x41e94Eb019C0762f9BFC45459c8716f73e158404", symbol: "USDC" },
    { address: "0x65aFadd39029741B3b8f0756952C74678c9cEC93", symbol: "LINK" },
];
const AMOY_TESTNET_NFT_CONTRACTS = ["0x1A1535A476236b2B523456952A1d24B30471677A"];

// Fungsi fetch dan send yang sudah ada tidak berubah (saya persingkat untuk kejelasan)
export const fetchTokenBalances = async (ownerAddress: string, provider: ethers.Provider): Promise<Erc20Balance[]> => { /* ...implementasi sama... */ return []; };
export const fetchNfts = async (ownerAddress: string, provider: ethers.Provider): Promise<NftData[]> => { /* ...implementasi sama... */ return []; };
export const sendErc20Token = async (contractAddress: string, recipientAddress: string, amount: string, signer: ethers.JsonRpcSigner): Promise<string> => { /* ...implementasi sama... */ return ""; };
export const sendNft = async (contractAddress: string, recipientAddress: string, tokenId: string, signer: ethers.JsonRpcSigner): Promise<string> => { /* ...implementasi sama... */ return ""; };


/**
 * Memperkirakan biaya gas untuk transfer ERC-20.
 * @returns Promise yang resolve ke string biaya gas yang diformat (mis. "0.001 MATIC").
 */
export const estimateErc20TransferGas = async (
    contractAddress: string,
    recipientAddress: string,
    amount: string,
    signer: ethers.JsonRpcSigner
): Promise<string> => {
    const contract = new ethers.Contract(contractAddress, erc20Abi, signer);
    const decimals = await contract.decimals();
    const amountToSend = ethers.parseUnits(amount, decimals);

    // Memperkirakan gas limit yang dibutuhkan untuk transaksi
    const gasLimit = await contract.transfer.estimateGas(recipientAddress, amountToSend);
    
    // Mendapatkan data harga gas saat ini dari jaringan
    const feeData = await signer.provider.getFeeData();
    
    if (!feeData.gasPrice) {
        throw new Error("Could not get gas price from provider.");
    }

    // Biaya = gas limit * harga gas
    const estimatedFee = gasLimit * feeData.gasPrice;
    
    return `${ethers.formatEther(estimatedFee)} MATIC`;
};

/**
 * Memperkirakan biaya gas untuk transfer NFT (ERC-721).
 * @returns Promise yang resolve ke string biaya gas yang diformat.
 */
export const estimateNftTransferGas = async (
    contractAddress: string,
    recipientAddress: string,
    tokenId: string,
    signer: ethers.JsonRpcSigner
): Promise<string> => {
    const contract = new ethers.Contract(contractAddress, erc721Abi, signer);
    const ownerAddress = await signer.getAddress();

    const gasLimit = await contract.safeTransferFrom.estimateGas(ownerAddress, recipientAddress, tokenId);
    const feeData = await signer.provider.getFeeData();

    if (!feeData.gasPrice) {
        throw new Error("Could not get gas price from provider.");
    }

    const estimatedFee = gasLimit * feeData.gasPrice;

    return `${ethers.formatEther(estimatedFee)} MATIC`;
};