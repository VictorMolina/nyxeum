import { useEffect, useState } from "react";
import {BigNumber} from "ethers";
import {
    useAccount,
    useContractRead,
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction
} from "wagmi";
import { ContractWriteResult } from "@/components/utils/types";

export const address: `0x${string}` = process.env.NYXEUM_GAME_PROXY_ADDRESS as `0x${string}`;
export const abi = require("../../abis/NyxeumGameV1.json").abi;

export function useIsHeroMinted(): boolean {
    const [isHeroMinted, setHeroMinted] = useState(false);
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'isHeroMinted',
        args: [],
        overrides: {
            from: account.address,
        },
        cacheOnBlock: true,
        watch: true,
        enabled: Boolean(account?.address),
    });

    useEffect(() => {
        if (read.isSuccess) {
            setHeroMinted(read.data as unknown as boolean || false);
        }
    }, [read]);

    return isHeroMinted;
}

export function useMintHeroCommit(): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'mintHeroCommit',
        args: [],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useMintHeroReveal(): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'mintHeroReveal',
        args: [],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useIsExploring(tokenId: BigNumber): boolean {
    const [isExploring, setExploring] = useState(false);
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'isExploring',
        args: [tokenId],
        overrides: {
            from: account.address,
        },
        cacheOnBlock: true,
        watch: true,
        enabled: Boolean(account?.address) && Boolean(tokenId),
    });

    useEffect(() => {
        if (read.isSuccess) {
            setExploring(read.data as unknown as boolean || false);
        }
    }, [read]);

    return isExploring;
}

export function useExploreCommit(tokenId: BigNumber): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'exploreCommit',
        args: [tokenId],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address) && Boolean(tokenId),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useExploreReveal(tokenId: BigNumber): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'exploreReveal',
        args: [tokenId],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address) && Boolean(tokenId),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useIsAttacking(tokenId: BigNumber): boolean {
    const [isAttacking, setAttacking] = useState(false);
    const account = useAccount();

    const read = useContractRead({
        address: address,
        abi: abi,
        functionName: 'isAttacking',
        args: [tokenId],
        overrides: {
            from: account.address,
        },
        cacheOnBlock: true,
        watch: true,
        enabled: Boolean(account?.address) && Boolean(tokenId),
    });

    useEffect(() => {
        if (read.isSuccess) {
            setAttacking(read.data as unknown as boolean || false);
        }
    }, [read]);

    return isAttacking;
}

export function useAttackCommit(tokenId: BigNumber, targetId: BigNumber | undefined): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'attackCommit',
        args: [tokenId, targetId],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address) && Boolean(tokenId) && Boolean(targetId),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}

export function useAttackReveal(tokenId: BigNumber): ContractWriteResult {
    const account = useAccount();

    const { config } = usePrepareContractWrite({
        address: address,
        abi: abi,
        functionName: 'attackReveal',
        args: [tokenId],
        overrides: {
            from: account.address,
        },
        enabled: Boolean(account?.address) && Boolean(tokenId),
    });

    const { data: transaction, isLoading: isPrepared, isSuccess: isStarted, isError, write } = useContractWrite(config)
    const { data, isSuccess } = useWaitForTransaction({
        hash: transaction?.hash,
    });

    const isLoading = !isSuccess && (isPrepared || isStarted)

    return { data, isLoading, isSuccess, isError, write };
}
