import {
    useIsExploring,
    useIsAttacking,
    useGetExploreCooldown,
    useGetAttackCooldown
} from "@/components/utils/NyxeumGameProxyHooks";
import HeroExploreCommit from "@/components/game/hero-explore/HeroExploreCommit";
import HeroExploreReveal from "@/components/game/hero-explore/HeroExploreReveal";
import {BigNumber, utils} from "ethers";

import {useBalanceOfReader as useNyxBalanceReader} from "@/components/utils/NyxEssenceHooks";
import HeroAttackReveal from "@/components/game/hero-attack/HeroAttackReveal";
import HeroAttackCommit from "@/components/game/hero-attack/HeroAttackCommit";
import HeroCard from "@/components/game/hero-card/HeroCard";
import {useEffect, useState} from "react";

const HeroDetails = ({ tokenId, setMessage }: Props) => {

    const [cooldown, setCooldown] = useState(0);

    const nyxBalance = useNyxBalanceReader();
    const isExploring = useIsExploring(tokenId);
    const exploreCooldown = useGetExploreCooldown(tokenId);
    const isAttacking = useIsAttacking(tokenId);
    const attackCooldown = useGetAttackCooldown(tokenId);

    useEffect(() => {
        const maxCooldown = Math.max(cooldown, exploreCooldown, attackCooldown);
        if (cooldown != maxCooldown) {
            setCooldown(maxCooldown);
        }
        cooldown > 0 && setTimeout(() => setCooldown(cooldown - 1), 1000);
    }, [cooldown, exploreCooldown, attackCooldown]);

    const exploreActions = (balance: BigNumber) => {
        if (isAttacking) {
            return null;
        }
        if (isExploring) {
            if (cooldown > 0) {
                return (<div>{`Explore Cooldown: ${cooldown}s`}</div>);
            } else {
                return (<HeroExploreReveal tokenId={tokenId} setMessage={setMessage} />)
            }
        } else if (utils.parseEther("1").lte(balance)) {
            return (<HeroExploreCommit tokenId={tokenId} />);
        } else {
            return (<div>Buy NYX to explore!</div>);
        }
    };

    const attackActions = (balance: BigNumber) => {
        if (isExploring) {
            return null;
        }
        if (isAttacking) {
            if (cooldown > 0) {
                return (<div>{`Attack Cooldown: ${cooldown}s`}</div>);
            } else {
                return (<HeroAttackReveal tokenId={tokenId} setMessage={setMessage} />)
            }
        } else if (utils.parseEther("1").lte(balance)) {
            return (<HeroAttackCommit tokenId={tokenId} setMessage={setMessage} />);
        } else {
            return (<div>Buy NYX to attack!</div>);
        }
    };

    return (
        <div>
            <HeroCard tokenId={tokenId} />
            <div style={{display: 'grid'}}>
                { exploreActions(nyxBalance) }
                { attackActions(nyxBalance) }
            </div>
        </div>
    );
};

interface Props {
    tokenId: BigNumber;
    setMessage: (message: JSX.Element | undefined) => void;
}

export default HeroDetails;
