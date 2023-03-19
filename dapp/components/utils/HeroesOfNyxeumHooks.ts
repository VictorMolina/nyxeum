import { useEffect, useState } from "react";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi";
import {SendTransactionResult} from "@wagmi/core";
import {BigNumber} from "ethers";

export const address: `0x${string}` = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const abi = require("../../abis/HeroesOfNyxeum.json").abi;

export function useBalanceReader(): BigNumber | undefined {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'balanceOf',
        args: [account.address || "0x0000000000000000000000000000000000000000"],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (read.isSuccess && !balance.eq(BigNumber.from(read.data))) {
            setBalance(BigNumber.from(read.data));
        }
    }, [balance, read]);

    return balance;
}

export function useCanRevealReader(): boolean {
    const [canReveal, setCanReveal] = useState(false);
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'canReveal',
        args: [],
        overrides: {
            from: account.address,
        },
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (read.isSuccess) {
            setCanReveal(read.data as unknown as boolean || false);
        }
    }, [read]);

    return canReveal;
}

export function useReveal(): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'reveal',
        args: [],
        overrides: {
            from: account.address,
        },
    })
    const { data, isLoading, isSuccess, isError, write } = useContractWrite(config)
    return { data, isLoading, isSuccess, isError, write };
}

interface ContractWriteResult {
    data: SendTransactionResult | undefined;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    write: (() => void) | undefined;
}
