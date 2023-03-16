import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useContract, useSigner } from 'wagmi';

import AcceptTerms from "@/pages/sections/play/AcceptTerms";
import Main from "@/pages/sections/play/Main";

// Move to final folder
const nyxEssenceABI = require("../../../abis/NyxEssence.json").abi;
const heroesOfNyxeumABI = require("../../../abis/HeroesOfNyxeum.json").abi;

const nyxEssenceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const heroesOfNyxeumAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const MIN_ALLOWANCE = BigNumber.from(2).pow(255);

const Play = () => {

    const [scene, setScene] = useState("ACCEPT_TERMS");

    const { data: signer } = useSigner();

    const nyxEssence = useContract({
        address: nyxEssenceAddress,
        abi: nyxEssenceABI,
        signerOrProvider: signer,
    });

    const heroesOfNyxeum = useContract({
        address: heroesOfNyxeumAddress,
        abi: heroesOfNyxeumABI,
        signerOrProvider: signer,
    });

    useEffect(() => {
        const hasAcceptedTerms = async () => {
            if (!nyxEssence?.signer) {
                return false;
            }
            const address = await nyxEssence?.signer.getAddress();
            const allowance = await nyxEssence?.allowance(address, heroesOfNyxeumAddress);

            return MIN_ALLOWANCE.lt(allowance);
        }
        hasAcceptedTerms()
            .then(accepted => setScene(accepted? "MAIN" : "ACCEPT_TERMS"))
            .catch(console.error);
    }, [nyxEssence, scene]);

    switch (scene) {
        case "ACCEPT_TERMS":
            return <AcceptTerms nyxEssence={nyxEssence} heroesOfNyxeum={heroesOfNyxeum} refreshScene={() => setScene("")} />
        case "MAIN":
            return <Main/>
        default:
            setScene("ACCEPT_TERMS");
            return null;
    }
};

export default Play;
