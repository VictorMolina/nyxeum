import { BigNumber } from "ethers";
import { useAccount } from "wagmi";

import AcceptTerms from "@/components/game/AcceptTerms";
import Main from "@/components/game/Main";

import { useAllowanceReader } from '@/components/utils/NyxEssenceHooks';

const MIN_ALLOWANCE = BigNumber.from(2).pow(255);

const Play = () => {
    const { isConnected } = useAccount()
    const allowance = useAllowanceReader();
    return isConnected && MIN_ALLOWANCE.lt(allowance || 0) ? <Main /> : <AcceptTerms />;
};

export default Play;
