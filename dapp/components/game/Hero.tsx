import { useTokenOfOwnerByIndex} from "@/components/utils/HeroesOfNyxeumHooks";

import HeroDetails from "@/components/game/HeroDetails";
import useDebounce from "@/components/utils/Debounce";

const Hero = ({ index }: Props) => {
    const tokenId = useTokenOfOwnerByIndex(index);
    const debouncedTokenId = useDebounce(tokenId);

    return debouncedTokenId ? (<HeroDetails tokenId={debouncedTokenId}/>) : null;
};

export interface Props {
    index: number;
}

export default Hero;
