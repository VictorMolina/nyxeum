import { useEffect, useState } from "react";
import { BigNumber, utils } from "ethers";
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

const Main = ({ nyxEssence, heroesOfNyxeum, refreshScene }: Props) => {

    const [ownedNyx, setOwnedNyx] = useState(0);
    const [tokens, setTokens] = useState<Array<IdentifiableHero>>([]);
    const [canReveal, setCanReveal] = useState(false);

    useEffect(() => {
        const loadOwnedNyx = async () => {
            if (!nyxEssence?.signer) {
                return;
            }
            const address = await nyxEssence.signer.getAddress();
            const tokenBalance = await nyxEssence?.balanceOf(address);
            setOwnedNyx(tokenBalance);
        }
        const loadCanReveal = async () => {
            if (!heroesOfNyxeum?.signer) {
                return;
            }
            const result = await heroesOfNyxeum?.canReveal();
            setCanReveal(result);
        }
        const refreshTokens = async () => {
            if (!heroesOfNyxeum?.signer) {
                return;
            }
            const address = await heroesOfNyxeum.signer.getAddress();
            const result: Array<IdentifiableHero> = [];
            const tokenBalance = await heroesOfNyxeum?.balanceOf(address);
            for (let i = 0; i < tokenBalance; i++) {
                const tokenId = await heroesOfNyxeum?.tokenOfOwnerByIndex(address, i);
                const metadata = await heroesOfNyxeum?.getNftMetadata(tokenId);
                result.push({tokenId, ...metadata});
            }
            setTokens(result);
        }
        loadOwnedNyx().catch(console.error);
        loadCanReveal().catch(console.error);
        refreshTokens().catch(console.error);
    }, [heroesOfNyxeum]);

    const buyNyx = async (value: BigNumber) => {
        if (!nyxEssence?.signer) {
            return;
        }
        await nyxEssence?.buy({ value });
        refreshScene();
    };

    const mintAHero = async () => {
        if (!heroesOfNyxeum?.signer) {
            return;
        }
        await heroesOfNyxeum?.commit();
        refreshScene();
    };

    const revealAHero = async () => {
        if (!heroesOfNyxeum?.signer) {
            return;
        }
        await heroesOfNyxeum?.reveal();
        refreshScene();
    };

    return (
        <>
            <div className={styles.grid}>
                <div>
                    <div>{`Owned NYX: ${utils.formatEther(ownedNyx)}`}</div>
                    <button className={styles.button} onClick={() => buyNyx(BigNumber.from(10).pow(16))}>Buy 10 NYX for 0.01 ETH</button>
                    {
                        canReveal ? (<button className={styles.button} onClick={revealAHero}>Reveal your Hero!</button>) :
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
                            <Image src={hero.imageUrl} alt={name} width={256} height={256} />
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
    refreshScene: any;
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
