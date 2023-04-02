import { useGetNftMetadata } from "@/components/utils/HeroesOfNyxeumHooks";
import Image from "next/image";
import {BigNumber} from "ethers";

import styles from "./HeroCard.module.css";

const HeroCard = ({ tokenId }: Props) => {

    const hero = useGetNftMetadata(tokenId);

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
                {name}: {level(score || 0)}<span className={styles.tooltiptext}>{description} {effect(score || 0)}</span>
            </div>
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
                <div className={styles.label}></div>
            </div>
        );
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
        </div>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroCard;
