import {BigNumber} from "ethers";

const AcceptTerms = ({ nyxEssence, heroesOfNyxeum, refreshScene }: Props) => {

    const acceptMaxAllowance = () => {
        const approve = async () => {
            if (!nyxEssence) {
                return;
            }
            await nyxEssence?.approve(heroesOfNyxeum.address, BigNumber.from(2).pow(256).sub(1).toHexString());
        }

        approve()
            .catch(console.error);

        refreshScene();
    }

    return (
        <>
            <button onClick={() => acceptMaxAllowance()}>ACCEPT TERMS</button>
        </>
    );
};

interface Props {
    nyxEssence: any;
    heroesOfNyxeum: any;
    refreshScene: any;
}

export default AcceptTerms;
