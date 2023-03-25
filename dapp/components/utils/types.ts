import {BigNumber} from "ethers";
import {TransactionReceipt} from "alchemy-sdk";

export interface ContractWriteResult {
    data: TransactionReceipt | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    write: (() => void) | undefined;
}

export interface HeroOfNyxeum {
    tokenId: BigNumber;
    strength: number;
    dexterity: number;
    intelligence: number;
    tough: number;
    powerful: number;
    precise: number;
    skilled: number;
    sharp: number;
    oracle: number;
}
