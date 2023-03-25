import { useGetNftMetadata } from "@/components/utils/HeroesOfNyxeumHooks";
import Image from "next/image";
import {useIsExploring} from "@/components/utils/NyxeumGameProxyHooks";
import HeroExploreCommit from "@/components/game/hero-explore/HeroExploreCommit";
import HeroExploreReveal from "@/components/game/hero-explore/HeroExploreReveal";
import {BigNumber, utils} from "ethers";

import styles from "./HeroDetails.module.css";
import {useBalanceOfReader as useNyxBalanceReader} from "@/components/utils/NyxEssenceHooks";

const HeroDetails = ({ tokenId }: Props) => {

    const nyxBalance = useNyxBalanceReader();

    const hero = useGetNftMetadata(tokenId);
    const isExploring = useIsExploring(tokenId);
    const isAttacking = false;

    const level = (score: number) => {
        if (score >= 27) return "S";
        else if (score >= 25) return "A";
        else if (score >= 18) return "B";
        else return "-";
    }

    const effect = (score: number) => {
        if (score >= 27) return "20%";
        else if (score >= 25) return "10%";
        else if (score >= 18) return "5%";
        else return "-";
    }

    const traitCard = (name: string, description: string, score: number | undefined) => {
        if ((score || 0) <= 17) {
            return null;
        }
        return (
            <div className={[styles.label, styles.tooltip].join(" ")}>
                {name}: {level(score || 0)}<span className={styles.tooltiptext}>{description} {effect(score || 0)}</span></div>
        );
    }

    const traits = () => {
        return (
            <div className={styles.labelGroup}>
                { traitCard("Tough", "Damage absorb", hero?.tough) }
                { traitCard("Powerful", "Damage amplifier", hero?.powerful) }
                { traitCard("Precise", "Crit damage amplifier", hero?.precise) }
                { traitCard("Skilled", "Crit chance amplifier", hero?.skilled) }
                { traitCard("Sharp", "Magical bonus amplifier", hero?.sharp) }
                { traitCard("Oracle", "Prevent enemy action", hero?.oracle) }
            </div>
        );
    };

    const exploreActions = (balance: BigNumber) => {
        if (isAttacking) {
            return null;
        }
        if (isExploring) {
            return (<HeroExploreReveal tokenId={tokenId} />)
        } else if (utils.parseEther("1").lte(balance)) {
            return (<HeroExploreCommit tokenId={tokenId} />);
        } else {
            return (<div>Buy NYX to explore!</div>);
        }
    };

    const attackActions = (balance: BigNumber) => {
        if (isExploring) {
            return null;
        }
        if (isAttacking) {
            return (<div>Reveal attack results!</div>)
        } else if (utils.parseEther("1").lte(balance)) {
            return (
                <>
                    <button className={styles.button}>Attack for 1.0 NYX</button>
                    <input className={styles.button} type="number" id="opponent" name="opponent" min="1" max="99999999" placeholder="Opponent ID"></input>
                </>);
        } else {
            return (<div>Buy NYX to explore!</div>);
        }
    };

    const name = `Hero Of Nyxeum #${tokenId}`;
    return (
        <div>
            <div>{name}</div>
            <br/>
            <Image src={`/nft/${tokenId}.png`} alt={name} width={256} height={256} />
            <div className={styles.labelGroup}>
                <div className={styles.label}>STR: {hero?.strength}</div>
                <div className={styles.label}>DEX: {hero?.dexterity}</div>
                <div className={styles.label}>INT: {hero?.intelligence}</div>
            </div>
            { traits() }
            <div style={{display: 'grid'}}>
                { exploreActions(nyxBalance) }
                { attackActions(nyxBalance) }
            </div>
        </div>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroDetails;
