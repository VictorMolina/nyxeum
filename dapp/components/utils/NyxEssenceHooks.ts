import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useAccount, useContractRead } from "wagmi";

import { address as heroesOfNyxeumAddress } from '@/components/utils/HeroesOfNyxeumHooks';

export const address: `0x${string}` = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const abi = require("../../abis/NyxEssence.json").abi;

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


export function useAllowanceReader(): BigNumber | undefined {
    const [allowance, setAllowance] = useState(BigNumber.from(0));
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'allowance',
        args: [account.address || "0x0000000000000000000000000000000000000000", heroesOfNyxeumAddress],
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
