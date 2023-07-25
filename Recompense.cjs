"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var spl_token_1 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var sec = [186, 248, 121, 175, 237, 2, 162, 98, 104, 112, 160, 23, 188, 216, 74, 67, 225, 90, 63, 33, 231, 222, 103, 207, 28, 81, 103, 0, 221, 88, 165, 215, 253, 109, 160, 184, 42, 173, 24, 90, 1, 226, 145, 64, 50, 52, 78, 233, 184, 18, 23, 38, 96, 117, 105, 217, 35, 246, 85, 133, 24, 107, 147, 56];
var FROM_KEYPAIR = web3_js_1.Keypair.fromSecretKey(new Uint8Array(sec));
console.log("My public key is: ".concat(FROM_KEYPAIR.publicKey.toString(), "."));
var QUICKNODE_RPC = 'https://purple-convincing-vineyard.solana-devnet.discover.quiknode.pro/cf92d95f9a509f465eb9c1a5fc27608acd1a13df/';
var SOLANA_CONNECTION = new web3_js_1.Connection(QUICKNODE_RPC);
//const DESTINATION_WALLET = 'EX89RC941UhmJWQBtf3tAEAWmPvdLxq9GUmrhZDiLeEf';
var MINT_ADDRESS = 'FPoJiniSwWVuzgz1j9fesTCLCgCgkmHqKYQn5KSNQ5rX'; //You must change this value!
//const TRANSFER_AMOUNT = 500;
function getNumberDecimals(MINT_ADDRESS) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var info, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, SOLANA_CONNECTION.getParsedAccountInfo(new web3_js_1.PublicKey(MINT_ADDRESS))];
                case 1:
                    info = _b.sent();
                    result = ((_a = info.value) === null || _a === void 0 ? void 0 : _a.data).parsed.info.decimals;
                    return [2 /*return*/, result];
            }
        });
    });
}
function sendTokens(DESTINATION_WALLET, TRANSFER_AMOUNT) {
    return __awaiter(this, void 0, void 0, function () {
        var sourceAccount, destinationAccount, numberDecimals, tx, latestBlockHash, _a, signature;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Sending ".concat(TRANSFER_AMOUNT, " ").concat((MINT_ADDRESS), " from ").concat((FROM_KEYPAIR.publicKey.toString()), " to ").concat((DESTINATION_WALLET), "."));
                    //Step 1
                    console.log("1 - Getting Source Token Account");
                    return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(SOLANA_CONNECTION, FROM_KEYPAIR, new web3_js_1.PublicKey(MINT_ADDRESS), FROM_KEYPAIR.publicKey)];
                case 1:
                    sourceAccount = _b.sent();
                    console.log("    Source Account: ".concat(sourceAccount.address.toString()));
                    //Step 2
                    console.log("2 - Getting Destination Token Account");
                    return [4 /*yield*/, (0, spl_token_1.getOrCreateAssociatedTokenAccount)(SOLANA_CONNECTION, FROM_KEYPAIR, new web3_js_1.PublicKey(MINT_ADDRESS), new web3_js_1.PublicKey(DESTINATION_WALLET))];
                case 2:
                    destinationAccount = _b.sent();
                    console.log("    Destination Account: ".concat(destinationAccount.address.toString()));
                    //Step 3
                    console.log("3 - Fetching Number of Decimals for Mint: ".concat(MINT_ADDRESS));
                    return [4 /*yield*/, getNumberDecimals(MINT_ADDRESS)];
                case 3:
                    numberDecimals = _b.sent();
                    console.log("    Number of Decimals: ".concat(numberDecimals));
                    //Step 4
                    console.log("4 - Creating and Sending Transaction");
                    tx = new web3_js_1.Transaction();
                    tx.add((0, spl_token_1.createTransferInstruction)(sourceAccount.address, destinationAccount.address, FROM_KEYPAIR.publicKey, TRANSFER_AMOUNT * Math.pow(10, numberDecimals)));
                    return [4 /*yield*/, SOLANA_CONNECTION.getLatestBlockhash('confirmed')];
                case 4:
                    latestBlockHash = _b.sent();
                    _a = tx;
                    return [4 /*yield*/, latestBlockHash.blockhash];
                case 5:
                    _a.recentBlockhash = _b.sent();
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(SOLANA_CONNECTION, tx, [FROM_KEYPAIR])];
                case 6:
                    signature = _b.sent();
                    console.log('\x1b[32m', //Green Text
                        "   Transaction Success!\uD83C\uDF89", "\n    https://explorer.solana.com/tx/".concat(signature, "?cluster=devnet"));
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = sendTokens;

