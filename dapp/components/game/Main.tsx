import {useEffect, useState} from "react";
import { BigNumber, utils } from "ethers";

import useDebounce from "@/components/utils/Debounce";
import { useBalanceOfReader as useNyxBalanceReader, useBuy } from '@/components/utils/NyxEssenceHooks';
import {
    useBalanceOfReader as useHeroBalanceReader,
} from "@/components/utils/HeroesOfNyxeumHooks";
import {
    useIsHeroMinted,
} from "@/components/utils/NyxeumGameProxyHooks";

import Hero from './Hero';
import styles from '@/styles/Home.module.css';
import HeroMintReveal from "@/components/game/hero-mint/HeroMintReveal";
import HeroMintCommit from "@/components/game/hero-mint/HeroMintCommit";

const Main = () => {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | undefined>();

    const [numHeroes, setNumHeroes] = useState(BigNumber.from(0));
    const debouncedNumHeroes = useDebounce(numHeroes, 500);

    const nyxBalance = useNyxBalanceReader();
    const buy10Nyx = useBuy(BigNumber.from(10).pow(16));

    const heroBalance = useHeroBalanceReader();
    const isHeroMinted = useIsHeroMinted();

    useEffect(() => {
        if (heroBalance) {
            setNumHeroes(heroBalance);
        }
    }, [heroBalance]);

    const heroActions = (balance: BigNumber) => {
        if (isHeroMinted) {
            return (<HeroMintReveal />);
        } else if (utils.parseEther("5").lte(balance)) {
            return (<HeroMintCommit />);
        } else {
            return (<div>Buy NYX to mint more heroes!</div>);
        }
    };

    const heroGallery = () => {
        return debouncedNumHeroes &&
        Array.from({ length: debouncedNumHeroes.toNumber() }, (v, i) => i)
            .map((index) => <Hero key={`hero_${index}`} index={index} setMessage={setMessage} />);
    }

    return (
        <>
            <div id={'loader'}>
                <div className={styles.maxScreen} hidden={!loading && !message}></div>
                <div className={styles.loader} hidden={!loading}></div>
                <div className={styles.message} hidden={!message}>
                    <p>{message}</p>
                    <br />
                    <button className={styles.button} onClick={() => setMessage(undefined)}>OK</button>
                </div>
            </div>
            <div className={styles.grid}>
                <div>
                    <div>{`Owned NYX: ${utils.formatEther(nyxBalance || 0)}`}</div>
                    <button className={styles.button} onClick={() => buy10Nyx?.write?.()}>Buy 10 NYX for 0.01 ETH</button>
                    { heroActions(nyxBalance) }
                </div>
            </div>
            <br />
            <div className={styles.grid}>
                { heroGallery() }
            </div>
        </>
    )
};

export default Main;
