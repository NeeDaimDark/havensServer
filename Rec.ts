import { Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction,clusterApiUrl } from '@solana/web3.js';
import { resolveToWalletAddress, getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import axios from "axios";
const connection = new Connection(clusterApiUrl("devnet"));
async function check(name:string,publicAddress:string) {
    try {
        const nfts = await getParsedNftAccountsByOwner({
            publicAddress: publicAddress,
            connection: connection,
        });

        for (let i = 0; i < nfts.length; i++) {
            if (nfts[i].data.creators[1] && nfts[i].data.creators[1].address === publicAddress && nfts[i].data.name.includes(name)) {
                console.log(nfts[i].data.name);
                return true;
            }
        }

        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};
export default check;