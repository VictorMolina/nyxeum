import styles from "@/styles/Home.module.css";
import {useAttackReveal} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber, utils} from "ethers";
import {useEffect, useState} from "react";
import useDebounce from "@/components/utils/Debounce";

const eventSignature = 'EndAttack(address,uint256,uint256,uint256,string)';
const eventSignatureHash = utils.id(eventSignature);

const HeroAttackReveal = ({ tokenId }: Props) => {

    const [attackLog, setAttackLog] = useState<string | undefined>(undefined);
    const debouncedAttackLog = useDebounce(attackLog);

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
        console.log(debouncedAttackLog);
    }, [debouncedAttackLog]);

    return (
        <button className={styles.button} onClick={() => heroAttackReveal?.write?.()}>Check the attack result</button>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroAttackReveal;
