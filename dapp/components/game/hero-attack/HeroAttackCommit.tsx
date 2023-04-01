import styles from "@/styles/Home.module.css";
import {useAttackCommit} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber, utils} from "ethers";
import {FormEvent, useEffect, useState} from "react";
import useDebounce from "@/components/utils/Debounce";

const HeroAttackCommit = ({ tokenId, setMessage }: Props) => {

    const [targetId, setTargetId] = useState<BigNumber | undefined>();
    const debouncedTargetId = useDebounce(targetId);

    const heroAttackCommit = useAttackCommit(tokenId, debouncedTargetId);

    useEffect(() => {
        if (targetId && debouncedTargetId && heroAttackCommit && heroAttackCommit.write === undefined) {
            setTargetId(undefined);
            const targetName = `Hero Of Nyxeum #${debouncedTargetId}`;
            const popup = (
                <div className={styles.popupMessage}>
                    <p style={{ fontWeight: "bold"}}>Attack Log</p>
                    <br />
                    <p>ERROR: Is not allowed to attack to {targetName}</p>
                    <br />
                    <button className={styles.button} onClick={() => {
                        setMessage(undefined);
                    }}>OK</button>
                </div>
            );
            setMessage(popup);
        }
    }, [heroAttackCommit, setMessage, targetId, debouncedTargetId]);

    return (
        <>
            <button className={styles.button} disabled={!targetId} onClick={() => heroAttackCommit?.write?.()}>Attack for 1.0 NYX</button>
            <input className={styles.button} type="number" id="opponent" name="opponent" required={true} min={1} max={9999} placeholder="Opponent ID" onChange={(e: FormEvent<HTMLInputElement>) => setTargetId(e?.currentTarget?.value ? BigNumber.from(e.currentTarget.value) : undefined)}></input>
        </>
    );
};

interface Props {
    tokenId: BigNumber;
    setMessage: (message: JSX.Element | undefined) => void;
}

export default HeroAttackCommit;
