import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
    useAccount,
    useContractRead,
} from "wagmi";
import { HeroOfNyxeum } from "@/components/utils/types";

export const address: `0x${string}` = process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS as `0x${string}`;
export const abi = require("../../abis/HeroesOfNyxeum.json").abi;

export function useTotalSupply(): BigNumber {
    const [result, setResult] = useState(BigNumber.from(0));

    const totalSupply = useContractRead({
        address: address,
        abi: abi,
        functionName: 'totalSupply',
        args: [],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (totalSupply.isSuccess && !result.eq(BigNumber.from(totalSupply.data))) {
            setResult(BigNumber.from(totalSupply.data));
        }
    }, [result, totalSupply.data, totalSupply.isSuccess]);

    return result;
}

export function useGetTokenLimit(): BigNumber {
    const [result, setResult] = useState(BigNumber.from(0));

    const getTokenLimit = useContractRead({
        address: address,
        abi: abi,
        functionName: 'getTokenLimit',
        args: [],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (getTokenLimit.isSuccess && !result.eq(BigNumber.from(getTokenLimit.data))) {
            setResult(BigNumber.from(getTokenLimit.data));
        }
    }, [result, getTokenLimit.data, getTokenLimit.isSuccess]);

    return result;
}

export function useBalanceOfReader(): BigNumber {
    const [balance, setBalance] = useState(BigNumber.from(0));
    const account = useAccount();

    const balanceOf = useContractRead({
        address: address,
        abi: abi,
        functionName: 'balanceOf',
        args: [account.address],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (balanceOf.isSuccess && !balance.eq(BigNumber.from(balanceOf.data))) {
            setBalance(BigNumber.from(balanceOf.data));
        }
    }, [balance, balanceOf]);

    return balance;
}

export function useTokenOfOwnerByIndex(index: number): BigNumber | undefined {
    const [tokenId, setTokenId] = useState<BigNumber | undefined>();
    const account = useAccount();

    const tokenOfOwnerByIndex = useContractRead({
        address: address,
        abi: abi,
        functionName: 'tokenOfOwnerByIndex',
        args: [account.address, BigNumber.from(index)],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (tokenOfOwnerByIndex.isSuccess && (!tokenId || !BigNumber.from(tokenOfOwnerByIndex.data).eq(tokenId))) {
            setTokenId(BigNumber.from(tokenOfOwnerByIndex.data));
        }
    }, [tokenId, tokenOfOwnerByIndex]);

    return tokenId;
}

export function useGetNftMetadata(tokenId: BigNumber): HeroOfNyxeum | undefined {
    const [metadata, setMetadata] = useState<HeroOfNyxeum>();

    const getNftMetadata = useContractRead({
        address: address,
        abi: abi,
        functionName: 'getNftMetadata',
        args: [tokenId],
        cacheOnBlock: true,
        watch: true,
    });

    useEffect(() => {
        if (metadata?.tokenId !== undefined) {
            return;
        }
        if (getNftMetadata.isSuccess) {
            setMetadata({ ...getNftMetadata.data as unknown as HeroOfNyxeum, tokenId: tokenId || BigNumber.from(0) });
        }
    }, [tokenId, metadata, getNftMetadata]);

    return metadata;
}
