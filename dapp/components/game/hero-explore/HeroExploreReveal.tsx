import styles from "@/styles/Home.module.css";
import {useExploreReveal} from "@/components/utils/NyxeumGameProxyHooks";
import {BigNumber, utils} from "ethers";
import {useEffect, useState} from "react";
import useDebounce from "@/components/utils/Debounce";

const eventSignature = 'EndExploration(address,uint256)';
const eventSignatureHash = utils.id(eventSignature);

const HeroExploreReveal = ({ tokenId }: Props) => {

    const [nyxFound, setNyxFound] = useState<BigNumber | undefined>(undefined);
    const debouncedNyxFound = useDebounce(nyxFound);

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
        setTimeout(() => setNyxFound(undefined), 2000);
    }, [debouncedNyxFound]);

    return (
        <>
            <button className={styles.button} onClick={() => heroExploreReveal?.write?.()}>Return from explore</button>
            { debouncedNyxFound ? (<p>{`NYX found: ${utils.formatEther(debouncedNyxFound)}`}</p>) : null }
        </>
    );
};

interface Props {
    tokenId: BigNumber;
}

export default HeroExploreReveal;
