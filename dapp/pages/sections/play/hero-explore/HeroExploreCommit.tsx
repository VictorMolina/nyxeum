import styles from "@/styles/Home.module.css";
import {useExploreCommit} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber} from "ethers";

const HeroExploreCommit = ({ tokenId }: Props) => {

    const heroExploreCommit = useExploreCommit(tokenId);

    return (
        <button className={styles.button} onClick={() => heroExploreCommit?.write?.()}>Explore for 1.0 NYX</button>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroExploreCommit;
