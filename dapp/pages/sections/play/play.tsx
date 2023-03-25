import { BigNumber } from "ethers";

import AcceptTerms from "@/components/game/AcceptTerms";
import Main from "@/components/game/Main";

import { useAllowanceReader } from '@/components/utils/NyxEssenceHooks';

const MIN_ALLOWANCE = BigNumber.from(2).pow(255);

const Play = () => {
    const allowance = useAllowanceReader();
    return MIN_ALLOWANCE.lt(allowance || 0) ? <Main /> : <AcceptTerms />;
};

export default Play;
