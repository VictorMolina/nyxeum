import styles from "@/styles/Home.module.css";
import {useMintHeroReveal} from "@/components/utils/NyxeumGameProxyHooks";

const HeroMintReveal = () => {

    const heroReveal = useMintHeroReveal();

    return (
        <button className={styles.button} onClick={() => heroReveal?.write?.()}>Reveal your Hero!</button>
    );
};

export default HeroMintReveal;
