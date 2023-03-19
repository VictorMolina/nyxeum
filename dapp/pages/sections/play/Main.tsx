import { useEffect, useState } from "react";
import { BigNumber, utils } from "ethers";
import { useWaitForTransaction } from 'wagmi'

import { useBalanceReader } from '@/components/utils/NyxEssenceHooks';
import { useCanRevealReader, useReveal } from "@/components/utils/HeroesOfNyxeumHooks";

import Image from 'next/image'
import styles from '@/styles/Home.module.css'

const Main = ({ nyxEssence, heroesOfNyxeum }: Props) => {

    const [tokens, setTokens] = useState<Array<IdentifiableHero>>([]);
    const [transaction, setTransaction] = useState<`0x${string}` | undefined>();

    const balance = useBalanceReader();
    const canReveal = useCanRevealReader();
    const reveal = useReveal();

    useEffect(() => {
        const refreshTokens = async () => {
            if (!heroesOfNyxeum?.signer) {
                return;
            }
            const address = await heroesOfNyxeum.signer.getAddress();
            const result: Array<IdentifiableHero> = [];
            const tokenBalance = await heroesOfNyxeum?.balanceOf(address);
            for (let i = 0; i < tokenBalance; i++) {
                const tokenId = await heroesOfNyxeum?.tokenOfOwnerByIndex(address, i);
                const metadata = await heroesOfNyxeum?.getNftMetadata(BigNumber.from(tokenId));
                result.push({tokenId, ...metadata});
            }
            setTokens(result);
        }
        refreshTokens().catch(console.error);
    }, [heroesOfNyxeum, nyxEssence]);

    const buyNyx = async (value: BigNumber) => {
        if (!nyxEssence?.signer) {
            return;
        }
        const tx = await nyxEssence?.buy({ value });
        setTransaction(tx.hash);
    };

    const mintAHero = async () => {
        if (!heroesOfNyxeum?.signer) {
            return;
        }
        const tx = await heroesOfNyxeum?.commit();
        setTransaction(tx.hash);
    };

    const { data, isError, isLoading } = useWaitForTransaction({
        hash: transaction,
    })

    useEffect(() => {
        return;
        if (!transaction) {
            return;
        }
        console.log(`Transaction: ${JSON.stringify(transaction)}`);
        if (isLoading) {
            console.log(`Waiting for transaction ${transaction}`);
        }
        if (isError) {
            console.error(`Error in transaction ${transaction}: ${data}`);
            setTransaction(undefined);
        }
        if (data) {
            console.log(`Transaction ${transaction} finished! ${JSON.stringify(data)}`);
            setTransaction(undefined);
        }
    }, [transaction, data, isError, isLoading]);

    return (
        <>
            <div className={styles.grid}>
                <div>
                    <div>{`Owned NYX: ${utils.formatEther(balance || 0)}`}</div>
                    <button className={styles.button} onClick={() => buyNyx(BigNumber.from(10).pow(16))}>Buy 10 NYX for 0.01 ETH</button>
                    {
                        canReveal ? (<button className={styles.button} onClick={() => reveal?.write && reveal?.write()}>Reveal your Hero!</button>) :
                            (<button className={styles.button} onClick={mintAHero}>Mint a Hero for 5 NYX</button>)
                    }
                </div>
            </div>
            <div className={styles.grid}>
                {
                    tokens.map((hero, i) => {
                        const name = `Hero Of Nyxeum #${hero.tokenId}`;
                        return <div key={hero.tokenId}>
                            <div>{name}</div>
                            <br/>
                            <Image src={`/nft/${hero.tokenId}.png`} alt={name} width={256} height={256} />
                            <div>STR: {hero.strength}</div>
                            <div>DEX: {hero.dexterity}</div>
                            <div>INT: {hero.intelligence}</div>
                            <button className={styles.button}>Explore</button>
                            <button className={styles.button}>Attack</button>
                        </div>
                    })
                }
            </div>
        </>
    )
};

interface Props {
    nyxEssence: any;
    heroesOfNyxeum: any;
}

interface Hero {
    imageUrl: string;
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

interface IdentifiableHero extends Hero {
    tokenId: number;
}

export default Main;
