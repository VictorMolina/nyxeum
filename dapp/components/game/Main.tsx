import {FormEvent, useState} from "react";
import { BigNumber, utils } from "ethers";

import { useBalanceOfReader as useNyxBalanceReader, useBuy } from '@/components/utils/NyxEssenceHooks';
import {
    useBalanceOfReader as useHeroBalanceReader,
    useGetTokenLimit as useHeroGetTokenLimit,
    useTotalSupply as useHeroTotalSupply
} from "@/components/utils/HeroesOfNyxeumHooks";
import {
    useIsHeroMinted,
} from "@/components/utils/NyxeumGameProxyHooks";

import Hero from './Hero';
import styles from '@/styles/Home.module.css';
import HeroMintReveal from "@/components/game/hero-mint/HeroMintReveal";
import HeroMintCommit from "@/components/game/hero-mint/HeroMintCommit";
import HeroCard from "@/components/game/hero-card/HeroCard";

const Main = () => {

    const [viewTokenId, setViewTokenId] = useState<BigNumber | undefined>();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<JSX.Element | undefined>();

    const nyxBalance = useNyxBalanceReader();
    const buy10Nyx = useBuy(BigNumber.from(10).pow(16));

    const heroTotalSupply = useHeroTotalSupply();
    const heroTokenLimit = useHeroGetTokenLimit();
    const heroBalance = useHeroBalanceReader();
    const isHeroMinted = useIsHeroMinted();

    const heroActions = (balance: BigNumber) => {
        if (BigNumber.from(4).lte(heroBalance)) {
            return (<div>MAX number of heroes reached</div>);
        }
        else if (isHeroMinted) {
            return (<HeroMintReveal />);
        } else if (utils.parseEther("5").lte(balance)) {
            return (<HeroMintCommit />);
        } else {
            return (<div>Buy NYX to mint up to 4 heroes</div>);
        }
    };

    const heroGallery = () => {
        return heroBalance &&
        Array.from({ length: heroBalance.toNumber() }, (v, i) => i)
            .map((index) => <Hero key={`hero_${index}`} index={index} setMessage={setMessage} />);
    }

    const viewNft = (tokenId: BigNumber) => {
        const popup = (
            <div className={styles.popupMessage}>
                <p style={{ fontWeight: "bold"}}>Inspect Hero of Nyxeum</p>
                <br />
                <HeroCard tokenId={tokenId} />
                <br />
                <button className={styles.button} onClick={() => setMessage(undefined)}>OK</button>
            </div>
        );
        setMessage(popup);
    }

    return (
        <>
            <div id={'loader'}>
                <div className={styles.maxScreen} hidden={!loading && !message}></div>
                <div className={styles.loader} hidden={!loading}></div>
                { message &&  (message)}
            </div>
            <div className={styles.grid}>
                <div>
                    <div>{`Owned NYX: ${utils.formatEther(nyxBalance || 0)}`}</div>
                    <button className={styles.button} onClick={() => buy10Nyx?.write?.()}>Buy 10 NYX for 0.01 ETH</button>
                </div>
                <div>
                    <div>{`Owned Heroes: ${heroBalance} of 4`}</div>
                    { heroActions(nyxBalance) }
                </div>
                <div>
                    <button style={{ width: '10rem' }} disabled={!viewTokenId} onClick={() => viewNft(viewTokenId || BigNumber.from(1)) }>Inspect Hero of Nyxeum</button>
                    <input className={styles.button} style={{ width: '10rem' }} type="number" id="viewNft" name="viewNft" required={true} min={1} max={9999} placeholder="Opponent ID" onChange={(e: FormEvent<HTMLInputElement>) => setViewTokenId(e?.currentTarget?.value ? BigNumber.from(e.currentTarget.value) : undefined)}></input>
                </div>
                <div>
                    <div>{`Heroes of Nyxeum: ${heroTotalSupply} of ${heroTokenLimit}`}</div>
                    <div>Season 1: NFTs from #001 to #100</div>
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
