import Tech from "@/pages/sections/tech/tech";
import Game from "@/pages/sections/game/game";
import Whitepaper from "@/pages/sections/whitepaper/whitepaper";
import Play from "@/pages/sections/play/play";

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
