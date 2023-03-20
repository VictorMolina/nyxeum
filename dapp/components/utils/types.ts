import { SendTransactionResult } from "@wagmi/core";
import {BigNumber} from "ethers";

export interface ContractWriteResult {
    data: SendTransactionResult | undefined;
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
