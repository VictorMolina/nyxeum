import { NextApiRequest, NextApiResponse } from 'next';
const hre = require("hardhat");
import { BigNumber } from "ethers";

export default async function metadata(req: NextApiRequest, res: NextApiResponse) {

    function getLevel(trait: string, score: number) {
        if (score < 18) {
            return undefined;
        } else if (score < 25) {
            return { trait, value: "Super" };
        } else if (score < 27) {
            return { trait, value: "Extremely" };
        } else {
            return { trait, value: "Godlike" };
        }
    }

    const HeroesOfNyxeum = await hre.ethers.getContractFactory('HeroesOfNyxeum');
    const heroesOfNyxeum = await HeroesOfNyxeum.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    const id = BigNumber.from((req.query.id || ['0'])[0]);
    const sheet = await heroesOfNyxeum._characters(id);

    const attributes : Array<any> = [

        // MAIN ATTRIBUTES
        {
            "display_type": "number",
            "trait_type": "Strength",
            "value": parseInt(`${sheet.strength}`)
        },
        {
            "display_type": "number",
            "trait_type": "Dexterity",
            "value": parseInt(`${sheet.dexterity}`)
        },
        {
            "display_type": "number",
            "trait_type": "Intelligence",
            "value": parseInt(`${sheet.intelligence}`)
        },

        // TRAITS
        {
            "trait_type": "Tough Score",
            "value": parseInt(`${sheet.tough}`)
        },
        {
            "trait_type": "Powerful Score",
            "value": parseInt(`${sheet.powerful}`)
        },
        {
            "trait_type": "Precise Score",
            "value": parseInt(`${sheet.precise}`)
        },
        {
            "trait_type": "Skilled Score",
            "value": parseInt(`${sheet.skilled}`)
        },
        {
            "trait_type": "Sharp Score",
            "value": parseInt(`${sheet.sharp}`)
        },
        {
            "trait_type": "Oracle Score",
            "value": parseInt(`${sheet.oracle}`)
        },
    ];

    // PROPERTIES
    [getLevel("Tough", sheet.tough),
        getLevel("Powerful", sheet.powerful),
        getLevel("Precise", sheet.precise),
        getLevel("Skilled", sheet.skilled),
        getLevel("Sharp", sheet.sharp),
        getLevel("Oracle", sheet.oracle)]
        .filter(prop => prop !== undefined)
        .map(prop => {return {
            "trait_type": prop?.trait,
            "value": prop?.value
        }})
        .forEach(trait => attributes.push(trait));

    res.status(200).json({
        "description": "Heroes of Nyxeum",
        "external_url": `https://nyxeum.vercel.app`,
        "image": `${sheet.imageUrl}`,
        "name": `Hero #${id}`,
        "attributes": attributes
    });
}
