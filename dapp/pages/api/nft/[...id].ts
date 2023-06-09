import { NextApiRequest, NextApiResponse } from 'next';
import { ethers, BigNumber } from "ethers";

export default async function metadata(req: NextApiRequest, res: NextApiResponse) {

    function getLevel(trait: string, score: number) {
        if (score < 18) {
            return undefined;
        } else if (score < 25) {
            return { trait, value: "Notably" };
        } else if (score < 27) {
            return { trait, value: "Extremely" };
        } else {
            return { trait, value: "Godlike" };
        }
    }

    const network = 'sepolia';
    const provider = new ethers.providers.EtherscanProvider(network, process.env.ETHERSCAN_API_KEY);
    let heroesOfNyxeum = new ethers.Contract(
        process.env.HEROES_OF_NYXEUM_CONTRACT_ADDRESS || '0x0',
        require("../../../abis/HeroesOfNyxeum.json").abi,
        provider);

    const id = BigNumber.from((req.query.id || ['0'])[0]);
    const nftMetadata = await heroesOfNyxeum.getNftMetadata(id);

    const attributes : Array<any> = [

        // MAIN ATTRIBUTES
        {
            "display_type": "number",
            "trait_type": "Strength",
            "value": parseInt(`${nftMetadata.strength}`)
        },
        {
            "display_type": "number",
            "trait_type": "Dexterity",
            "value": parseInt(`${nftMetadata.dexterity}`)
        },
        {
            "display_type": "number",
            "trait_type": "Intelligence",
            "value": parseInt(`${nftMetadata.intelligence}`)
        },

        // TRAITS
        {
            "trait_type": "Tough Score",
            "value": parseInt(`${nftMetadata.tough}`)
        },
        {
            "trait_type": "Powerful Score",
            "value": parseInt(`${nftMetadata.powerful}`)
        },
        {
            "trait_type": "Precise Score",
            "value": parseInt(`${nftMetadata.precise}`)
        },
        {
            "trait_type": "Skilled Score",
            "value": parseInt(`${nftMetadata.skilled}`)
        },
        {
            "trait_type": "Sharp Score",
            "value": parseInt(`${nftMetadata.sharp}`)
        },
        {
            "trait_type": "Oracle Score",
            "value": parseInt(`${nftMetadata.oracle}`)
        },
    ];

    // PROPERTIES
    [getLevel("Tough", nftMetadata.tough),
        getLevel("Powerful", nftMetadata.powerful),
        getLevel("Precise", nftMetadata.precise),
        getLevel("Skilled", nftMetadata.skilled),
        getLevel("Sharp", nftMetadata.sharp),
        getLevel("Oracle", nftMetadata.oracle)]
        .filter(prop => prop !== undefined)
        .map(prop => {return {
            "trait_type": prop?.trait,
            "value": prop?.value
        }})
        .forEach(trait => attributes.push(trait));

    res.status(200).json({
        "description": "Heroes of Nyxeum",
        "external_url": `https://nyxeum.vercel.app`,
        "image": `https://nyxeum.vercel.app/nft/${id}.png`,
        "name": `Hero of Nyxeum #${id}`,
        "attributes": attributes
    });
}
