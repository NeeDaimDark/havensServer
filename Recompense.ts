import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import { Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
const sec =[186,248,121,175,237,2,162,98,104,112,160,23,188,216,74,67,225,90,63,33,231,222,103,207,28,81,103,0,221,88,165,215,253,109,160,184,42,173,24,90,1,226,145,64,50,52,78,233,184,18,23,38,96,117,105,217,35,246,85,133,24,107,147,56];
const FROM_KEYPAIR = Keypair.fromSecretKey(new Uint8Array(sec));
console.log(`My public key is: ${FROM_KEYPAIR.publicKey.toString()}.`);
const QUICKNODE_RPC = 'https://purple-convincing-vineyard.solana-devnet.discover.quiknode.pro/cf92d95f9a509f465eb9c1a5fc27608acd1a13df/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
//const DESTINATION_WALLET = 'EX89RC941UhmJWQBtf3tAEAWmPvdLxq9GUmrhZDiLeEf';
const MINT_ADDRESS = 'FPoJiniSwWVuzgz1j9fesTCLCgCgkmHqKYQn5KSNQ5rX'; //You must change this value!
//const TRANSFER_AMOUNT = 500;
async function getNumberDecimals(MINT_ADDRESS: string):Promise<number> {
    const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(MINT_ADDRESS));
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
}

async function sendTokens(DESTINATION_WALLET:any,TRANSFER_AMOUNT:any) {
    console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(FROM_KEYPAIR.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
    //Step 1
    console.log(`1 - Getting Source Token Account`);
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION,
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        FROM_KEYPAIR.publicKey
    );
    console.log(`    Source Account: ${sourceAccount.address.toString()}`);
    //Step 2
    console.log(`2 - Getting Destination Token Account`);
    let destinationAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION,
        FROM_KEYPAIR,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET)
    );
    console.log(`    Destination Account: ${destinationAccount.address.toString()}`);
    //Step 3
    console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
    const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
    console.log(`    Number of Decimals: ${numberDecimals}`);
    //Step 4
    console.log(`4 - Creating and Sending Transaction`);
    const tx = new Transaction();
    tx.add(createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        FROM_KEYPAIR.publicKey,
        TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    ))
    const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');
    tx.recentBlockhash = await latestBlockHash.blockhash;
    const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION,tx,[FROM_KEYPAIR]);
    console.log(
        '\x1b[32m', //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
}
sendTokens("EX89RC941UhmJWQBtf3tAEAWmPvdLxq9GUmrhZDiLeEf",100);
export default sendTokens ;
