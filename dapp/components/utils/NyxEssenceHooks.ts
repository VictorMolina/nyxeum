import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import { ContractWriteResult } from "@/components/utils/types";

import { address as nyxeumGameProxyAddress } from '@/components/utils/NyxeumGameProxyHooks';

export const address: `0x${string}` = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const abi = require("../../abis/NyxEssence.json").abi;

export function useBalanceOfReader(): BigNumber {
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

export function useAllowanceReader(): BigNumber | undefined {
    const [allowance, setAllowance] = useState(BigNumber.from(0));
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'allowance',
        args: [account.address || "0x0000000000000000000000000000000000000000", nyxeumGameProxyAddress],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (read.isSuccess && !allowance.eq(BigNumber.from(read.data))) {
            setAllowance(BigNumber.from(read.data));
        }
    }, [allowance, read]);

    return allowance;
}

export function useAcceptTerms(): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'approve',
        args: [nyxeumGameProxyAddress, BigNumber.from(2).pow(256).sub(1)],
        overrides: {
            from: account.address,
        },
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useBuy(value: BigNumber): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'buy',
        args: [],
        overrides: {
            from: account.address,
            value: value,
        },
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}
