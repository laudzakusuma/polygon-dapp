import { ethers } from 'ethers';

// GANTI DENGAN API KEY ANDA
const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;

const API_URL = "https://api-amoy.polygonscan.com/api";

export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    timeStamp: string;
    isError: string;
}

/**
 * Mengambil daftar transaksi untuk sebuah alamat.
 * @param address Alamat dompet.
 * @returns Promise yang resolve ke array Transaction.
 */
export const fetchTransactions = async (address: string): Promise<Transaction[]> => {
    // Pemeriksaan keamanan untuk memastikan API key ada
    if (!POLYGONSCAN_API_KEY) {
        console.error("PolygonScan API Key is not set.");
        throw new Error("API Key for PolygonScan is missing.");
    }

    const params = new URLSearchParams({
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '25',
        sort: 'desc',
        apikey: POLYGONSCAN_API_KEY,
    });

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status === "1") {
            return data.result as Transaction[];
        } else {
            console.error("PolygonScan API Error:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        throw new Error("Could not fetch transaction history.");
    }
};