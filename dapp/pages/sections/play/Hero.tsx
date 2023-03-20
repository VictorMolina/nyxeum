import { useTokenOfOwnerByIndex} from "@/components/utils/HeroesOfNyxeumHooks";

import HeroDetails from "@/pages/sections/play/HeroDetails";

const Hero = ({ index }: Props) => {
    const tokenId = useTokenOfOwnerByIndex(index);
    return tokenId ? (<HeroDetails tokenId={tokenId} />) : null;
};

export interface Props {
    index: number;
}

export default Hero;
