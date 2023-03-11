import Tech from "@/pages/sections/tech";
import Game from "@/pages/sections/game";
import Whitepaper from "@/pages/sections/whitepaper";
import Play from "@/pages/sections/play";

export enum SectionCodes { GAME, TECH, WHITEPAPER, PLAY }

const SectionWrapper = ({ sectionCode }: Props) => {
    switch (sectionCode) {
        case SectionCodes.GAME:
            return (<Game />);
        case SectionCodes.TECH:
            return (<Tech />);
        case SectionCodes.WHITEPAPER:
            return (<Whitepaper />);
        case SectionCodes.PLAY:
            return (<Play />);
        default:
            return null;
    }
};

interface Props {
    sectionCode: SectionCodes;
}

export default SectionWrapper;
