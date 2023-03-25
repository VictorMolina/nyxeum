import styles from "@/styles/Home.module.css";
import {useMintHeroCommit} from "@/components/utils/NyxeumGameProxyHooks";

const HeroMintCommit = () => {

    const heroCommit = useMintHeroCommit();

    return (
        <button className={styles.button} onClick={() => heroCommit?.write?.()}>Mint a Hero for 5 NYX</button>
    );
};

export default HeroMintCommit;
