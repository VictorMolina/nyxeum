import { BigNumber } from "ethers";
import { useContract, useSigner } from 'wagmi';

import AcceptTerms from "@/pages/sections/play/AcceptTerms";
import Main from "@/pages/sections/play/Main";

import { useAllowanceReader } from '@/components/utils/NyxEssenceHooks';

// Move to final folder
const nyxEssenceABI = require("../../../abis/NyxEssence.json").abi;
const heroesOfNyxeumABI = require("../../../abis/HeroesOfNyxeum.json").abi;

const nyxEssenceAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const heroesOfNyxeumAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const MIN_ALLOWANCE = BigNumber.from(2).pow(255);

const Play = () => {
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

    const allowance = useAllowanceReader();

    return MIN_ALLOWANCE.lt(allowance || 0) ?
        (
            <Main nyxEssence={nyxEssence} heroesOfNyxeum={heroesOfNyxeum} />
        ) : (
            <AcceptTerms nyxEssence={nyxEssence} heroesOfNyxeum={heroesOfNyxeum} />
        );
};

export default Play;
