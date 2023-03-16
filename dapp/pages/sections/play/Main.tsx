import { useEffect, useState } from "react";
import { useContract, useSigner } from 'wagmi';
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// Move to final folder
const ensRegistryABI = require('../../../abis/HeroesOfNyxeum.json').abi;

const Main = () => {

    const [tokens, setTokens] = useState<Array<IdentifiableHero>>([]);

    const { data: signer } = useSigner();

    const heroesOfNyxeum = useContract({
        address: contractAddress,
        abi: ensRegistryABI,
        signerOrProvider: signer,
    });

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
                const metadata = await heroesOfNyxeum?.getNftMetadata(tokenId);
                result.push({tokenId, ...metadata});
            }
            setTokens(result);
        }
        refreshTokens()
            .catch(console.error);
    }, [heroesOfNyxeum])

    return (
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
    )
};

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
