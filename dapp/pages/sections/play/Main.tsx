import {useEffect, useState} from "react";
import { BigNumber, utils } from "ethers";

import { useBalanceOfReader as useNyxBalanceReader, useBuy } from '@/components/utils/NyxEssenceHooks';
import {
    useBalanceOfReader as useHeroBalanceReader,
    useCanRevealReader,
    useMintHero,
    useReveal
} from "@/components/utils/HeroesOfNyxeumHooks";

import Hero from './Hero';
import styles from '@/styles/Home.module.css';

const Main = () => {

    const [loading, setLoading] = useState(false);

    const nyxBalance = useNyxBalanceReader();
    const buy10Nyx = useBuy(BigNumber.from(10).pow(16));

    const heroBalance = useHeroBalanceReader();
    const mintHero = useMintHero();
    const canReveal = useCanRevealReader();
    const reveal = useReveal();

    useEffect(() => {
        setLoading(buy10Nyx.isLoading || mintHero.isLoading || reveal.isLoading);
    }, [buy10Nyx, mintHero, reveal]);

    return (
        <>
            <div id={'loader'}>
                <div className={styles.maxScreen} hidden={!loading}></div>
                <div className={styles.loader} hidden={!loading}></div>
            </div>
            <div className={styles.grid}>
                <div>
                    <div>{`Owned NYX: ${utils.formatEther(nyxBalance || 0)}`}</div>
                    <button className={styles.button} onClick={() => buy10Nyx?.write?.()}>Buy 10 NYX for 0.01 ETH</button>
                    {
                        canReveal ? (<button className={styles.button} onClick={() => reveal?.write?.()}>Reveal your Hero!</button>) :
                            (<button className={styles.button} onClick={() => mintHero?.write?.()}>Mint a Hero for 5 NYX</button>)
                    }
                </div>
            </div>
            <div className={styles.grid}>
                {
                    heroBalance &&
                    Array.from({ length: heroBalance.toNumber() }, (v, i) => i)
                        .map((index) => <Hero key={`hero_${index}`} index={index} />)
                }
            </div>
        </>
    )
};

export default Main;
