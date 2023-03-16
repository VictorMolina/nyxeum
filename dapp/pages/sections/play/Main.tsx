import { useEffect, useState } from "react";
import { useContract, useSigner } from 'wagmi';

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// Move to final folder
const ensRegistryABI = require('../../../abis/HeroesOfNyxeum.json').abi;

const Main = () => {

    const [tokens, setTokens] = useState<Array<number>>([]);

    const { data: signer } = useSigner();

    const heroesOfNyxeum = useContract({
        address: contractAddress,
        abi: ensRegistryABI,
        signerOrProvider: signer,
    });

    useEffect(() => {
        const refreshTokens = async () => {
            if (!heroesOfNyxeum?.signer) {
                return;
            }
            const address = await heroesOfNyxeum.signer.getAddress();
            const result: Array<number> = [];
            const tokenBalance = await heroesOfNyxeum?.balanceOf(address);
            for (let i = 0; i < tokenBalance; i++) {
                result.push(await heroesOfNyxeum?.tokenOfOwnerByIndex(address, i));
            }
            setTokens(result);
        }
        refreshTokens()
            .catch(console.error);
    }, [heroesOfNyxeum])

    return (
        <>
            { tokens.map((t, i) => { return <span key={i.toString()}>{JSON.stringify(t)}</span>}) }
        </>
    )
};

export default Main;
