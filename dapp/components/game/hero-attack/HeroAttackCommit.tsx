import styles from "@/styles/Home.module.css";
import {useAttackCommit} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber} from "ethers";
import {FormEvent, useState} from "react";
import useDebounce from "@/components/utils/Debounce";

const HeroAttackCommit = ({ tokenId }: Props) => {

    const [targetId, setTargetId] = useState<BigNumber | undefined>();
    const debouncedTargetId = useDebounce(targetId);

    const heroAttackCommit = useAttackCommit(tokenId, debouncedTargetId);

    return (
        <>
            <button className={styles.button} disabled={!targetId} onClick={() => heroAttackCommit?.write?.()}>Attack for 1.0 NYX</button>
            <input className={styles.button} type="number" id="opponent" name="opponent" required={true} min={1} max={9999} placeholder="Opponent ID" onChange={(e: FormEvent<HTMLInputElement>) => setTargetId(e?.currentTarget?.value ? BigNumber.from(e.currentTarget.value) : undefined)}></input>
        </>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroAttackCommit;
