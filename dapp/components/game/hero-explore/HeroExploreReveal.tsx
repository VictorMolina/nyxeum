import styles from "@/styles/Home.module.css";
import {useExploreReveal} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber, utils} from "ethers";
import {useEffect, useState} from "react";
import Image from "next/image";

const eventSignature = 'EndExploration(address,uint256)';
const eventSignatureHash = utils.id(eventSignature);

const HeroExploreReveal = ({ tokenId, setMessage }: Props) => {

    const [nyxFound, setNyxFound] = useState<BigNumber | undefined>(undefined);

    const heroExploreReveal = useExploreReveal(tokenId);

    useEffect(() => {
        heroExploreReveal?.data?.logs?.forEach(log => {
            if (log.topics[0] === eventSignatureHash) {
                const decodedEvent = utils.defaultAbiCoder.decode(
                    [
                        'address',
                        'uint256'
                    ],
                    log.data
                );
                setNyxFound(decodedEvent?.[1]);
            }
        });
    }, [heroExploreReveal?.data?.logs]);

    useEffect(() => {
        if (nyxFound) {
            const popup = (
                <div className={styles.popupMessage}>
                    <p style={{ fontWeight: "bold"}}>Explore Log</p>
                    <br />
                    <p>NYX found: {utils.formatEther(nyxFound)}</p>
                    <br />
                    <button className={styles.button} onClick={() => setMessage(undefined)}>OK</button>
                </div>
            );
            setMessage(popup);
        }
    }, [nyxFound, setMessage]);

    return (
        <>
            <button className={styles.button} onClick={() => heroExploreReveal?.write?.()}>Return from explore</button>
        </>
    );
};

interface Props {
    tokenId: BigNumber;
    setMessage: (message: JSX.Element | undefined) => void;
}

export default HeroExploreReveal;
