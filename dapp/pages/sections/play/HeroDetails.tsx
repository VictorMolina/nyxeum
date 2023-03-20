import {BigNumber} from "ethers";
import { useGetNftMetadata } from "@/components/utils/HeroesOfNyxeumHooks";

import Image from "next/image";
import styles from "@/styles/Home.module.css";

const HeroDetails = ({ tokenId }: Props) => {
    const hero = useGetNftMetadata(tokenId);

    const name = `Hero Of Nyxeum #${tokenId}`;
    return (
        <div>
            <div>{name}</div>
            <br/>
            <Image src={`/nft/${tokenId}.png`} alt={name} width={256} height={256} />
            <div>STR: {hero?.strength}</div>
            <div>DEX: {hero?.dexterity}</div>
            <div>INT: {hero?.intelligence}</div>
            <button className={styles.button}>Explore</button>
            <button className={styles.button}>Attack</button>
        </div>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroDetails;
