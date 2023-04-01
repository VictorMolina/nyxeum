import { useTokenOfOwnerByIndex} from "@/components/utils/HeroesOfNyxeumHooks";

import HeroDetails from "@/components/game/HeroDetails";
import useDebounce from "@/components/utils/Debounce";

const Hero = ({ index, setMessage }: Props) => {
    const tokenId = useTokenOfOwnerByIndex(index);
    const debouncedTokenId = useDebounce(tokenId);

    return debouncedTokenId ? (<HeroDetails tokenId={debouncedTokenId} setMessage={setMessage} />) : null;
};

export interface Props {
    index: number;
    setMessage: (message: JSX.Element | undefined) => void;
}

export default Hero;
