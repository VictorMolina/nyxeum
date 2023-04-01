import styles from "@/styles/Home.module.css";
import {useAttackReveal} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber, utils} from "ethers";
import {useEffect, useState} from "react";
import Image from "next/image";

const eventSignature = 'EndAttack(address,uint256,uint256,uint256,string)';
const eventSignatureHash = utils.id(eventSignature);

const HeroAttackReveal = ({ tokenId, setMessage }: Props) => {

    const [attackLog, setAttackLog] = useState<string | undefined>(undefined);

    const heroAttackReveal = useAttackReveal(tokenId);

    useEffect(() => {
        heroAttackReveal?.data?.logs?.forEach(log => {
            if (log.topics[0] === eventSignatureHash) {
                const decodedEvent = utils.defaultAbiCoder.decode(
                    [
                        'address',
                        'uint256',
                        'uint256',
                        'uint256',
                        'string'
                    ],
                    log.data
                );
                setAttackLog(decodedEvent?.[4]);
            }
        });
    }, [heroAttackReveal?.data?.logs]);

    useEffect(() => {
        if (tokenId && attackLog) {
            const name = `Hero Of Nyxeum #${tokenId}`;
            const popup = (
                <div className={styles.popupMessage}>
                    <p style={{ fontWeight: "bold"}}>Attack Log</p>
                    <br />
                    { attackLog.split(' // ').map((log_item, index) => (<p key={`attack_log_${index}`}>{log_item}</p>)) }
                    <br />
                    <button className={styles.button} onClick={() => setMessage(undefined)}>OK</button>
                </div>
            );
            setMessage(popup);
        }
    }, [attackLog, setMessage, tokenId]);

    return (
        <button className={styles.button} onClick={() => heroAttackReveal?.write?.()}>Check the attack result</button>
    );
};

interface Props {
    tokenId: BigNumber;
    setMessage: (message: JSX.Element | undefined) => void;
}

export default HeroAttackReveal;
