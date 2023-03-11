import Image from 'next/image'
import { Inter } from "next/font/google";
import styles from '@/styles/Home.module.css'
import {Mermaid} from "mdx-mermaid/lib/Mermaid";

const inter = Inter({ subsets: ['latin'] })

const Whitepaper = () => {
    return (
        <>
            <h1 className={[styles.title, inter.className].join(" ")}>Nyxeum</h1>
            <h2 className={[styles.subtitle, inter.className].join(" ")}>An NFT Survival Game</h2>
            <h2 className={[styles.note, inter.className].join(" ")}>
                An infinite-supply AI generated NFT collection living on the Ethereum blockchain
            </h2>
            <hr className={styles.mono_section} />
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    1. Storyline
                </p>
                <p className={inter.className}>
                    Nyxeum is a capstone project of Alchemy&apos;s &quot;Ethereum Developer Bootcamp&quot; course and
                    implements a decentralized application on the Ethereum blockchain. Built around an RPG, the main
                    product of this project is an endless collection of AI-generated NFTs that represent the inhabitants
                    of this world willing to fight each other for survival.
                </p>
            </div>
            <div className={[styles.mono_section].join(" ")}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    2. How it works?
                </p>
                <p className={inter.className}>
                    Nyxeum is an infinite-supply AI generated NFT collection. The value of each token relies on the
                    random values assigned to its metadata.
                </p>
                <br/>
                <div className={styles.mermaid_chart}>
                    <Mermaid
                        key={`whitepaper_hiw_1`}
                        config={{mermaid: {theme: 'dark'}}}
                        chart={`
                            stateDiagram
                            state NFT {
                              Image
                              STR/DEX/INT
                              Traits
                            }
                        `} />
                </div>
                <br/>
                <p className={inter.className}>
                    NYX is an ERC20 token that brings life to Nyxeum NFTs. There is a fixed total supply of NYX that
                    will be spread between game and players. When an NFT is minted a bunch of NYX is assigned to it.
                    This token is used as energy and any action will consume it. Some actions may have a return of
                    investment, such as exploring or attacking.
                    The result of these actions is randomly determined by the NFT metadata.
                </p>
                <br/>
                <div className={styles.mermaid_chart}>
                    <Mermaid
                        key={`whitepaper_hiw_2`}
                        config={{mermaid: {theme: 'dark'}}}
                        chart={`
                            stateDiagram
                            direction LR
                            [*] --> NFT : mint
                            state NFT {
                              1NYX*
                              STR/DEX/INT
                              Traits
                            }
                            state GamePool {
                              1_000_000_000NYX*
                            }
                            NFT --> Game : explore
                            NFT --> GamePool : 0.1NYX*
                            GamePool --> NFT : (0.15NYX*)
                        `} />
                </div>
                <br/>
                <p className={inter.className}>
                    In order to guarantee NYX liquidity every 24 hours from the minting date the player NFT will move
                    a small amount of NYX to the game pool, this action is call &quot;The Nyx tribute&quot;, in case of
                    not having NYX currency at that moment the player will be marked as &quot;exiled&quot; and it
                    won&apos;t be able to spend NYX anymore.
                </p>
                <br/>
                <div className={styles.mermaid_chart}>
                    <Mermaid
                        key={`whitepaper_hiw_3`}
                        config={{mermaid: {theme: 'dark'}}}
                        chart={`
                            stateDiagram
                            direction LR
                            state NFT {
                              1NYX*
                            }
                            state GamePool {
                              1_000_000_000NYX*
                            }
                            NFT --> GamePool : 0.1NYX*
                            Automation --> NFT : Nyx tribute
                        `} />
                </div>
                <br/>
                <p className={[styles.note, inter.className].join(" ")}>
                    (*) The NYX amounts used in this page are just examples, they may not be the real amounts.
                </p>
            </div>
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    3. Roadmap
                </p>
                <div className={styles.mermaid_chart}>
                    <Mermaid
                        key={`whitepaper_r_1`}
                        config={{mermaid: {theme: 'dark'}}}
                        chart={`
                            timeline
                                section Exploration
                                    Month 1: Gameplay
                                            : Image Generation
                                            : Social Media
                                section Website
                                    Month 2   : Whitepaper
                                            : Static Website
                                            : Wallet Connect
                                section Blockchain
                                    Month 3   : ERC20 and ERC721
                                            : Proxy
                                            : Smart Contract
                                            : Chainlink Automation
                                section DApp
                                    Month 4     : Game DApp
                                section Soft Launch
                                    Month 5     : Promotion
                                                : First mint
                                                : Beta
                                section Worldwide
                                    Month 6     : Promotion
                                                : Mint
                                                : Release
                        `} />
                </div>
            </div>
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    4. Social Media
                </p>
                <p className={inter.className}>
                    &raquo; <a href={"https://discord.gg/CpaQD3d7ZN"} target={"_blank"}>Nyxeum Discord</a>
                    <br/>
                    &raquo; <a href={"mailto://nyxeum.dapp@gmail.com"} target={"_blank"}>nyxeum.dapp@gmail.com</a>
                </p>
            </div>
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    5. Team
                </p>
                <p className={inter.className}>
                    &raquo;
                    Victor Molina /
                    Founder /
                    <a href={"https://es.linkedin.com/in/v%C3%ADctor-molina-beas-36968814"} target={"_blank"} style={{verticalAlign: "middle"}}>
                        &nbsp;<Image src="/images/In-Blue-21.png" alt="LinkedIn profile" width="21" height="21" />&nbsp;
                    </a>/
                    Alchemy student & Senior Software Engineer
                </p>
            </div>
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    6. Properties
                </p>
                <p className={inter.className}>
                    The Nyxeum collection contains the following properties in the NFT metadata:
                    <br />
                    <br />
                    <b>Main attributes</b>
                    <br />
                    There are three main attributes in Nyxeum: Strength, Dexterity and Intelligence. Each one of them is
                    calculated through the mint phase as a random number between 0 and 99.
                    <br />
                    <br />
                    &raquo; Strength: Represents the physical state. A character with a high value in this attribute
                    will be tough and hit hard.
                    <br />
                    &raquo; Dexterity: Represents the reaction ability. A character with a high value in this attribute
                    will react faster to avoid or assign targets.
                    <br />
                    &raquo; Intelligence: Represents the psychic state. A character with a high value in this attribute
                    will be able to use magic.
                    <br />
                    <br />
                    <b>Traits</b>
                    <br />
                    Each character is special in Nyxeum and six different traits have been created for this. Each trait
                    is calculated through the mint phase as a random number between 0 and 27. This number is assigned
                    to one mastery level:
                    <br />
                    0-17: Level I =&gt; Effect bonus 0%
                    <br />
                    18-24: Level II =&gt; Effect bonus 5%
                    <br />
                    25-26: Level III =&gt; Effect bonus 10%
                    <br />
                    27: Level IV =&gt; Effect bonus 20%
                    <br />
                    <br />
                    &raquo; Tough (Strength trait): Damage absorb
                    <br />
                    &raquo; Powerful (Strength trait): Damage amplifier
                    <br />
                    &raquo; Precise (Dexterity trait): Crit damage amplifier
                    <br />
                    &raquo; Skilled (Dexterity trait): Crit chance amplifier
                    <br />
                    &raquo; Sharp (Intelligence trait): Magical bonus amplifier
                    <br />
                    &raquo; Oracle (Intelligence trait): Prevent enemy action
                </p>
            </div>
            <div className={styles.mono_section}>
                <p className={[styles.subtitle, inter.className].join(" ")}>
                    7. Ecosystem
                </p>
                <p className={inter.className}>
                    &raquo; This project integrates AlchemySDK and uses an <a href={"https://www.alchemy.com/"} target={"_blank"}>Alchemy</a> App to connect to the Ethereum
                    blockchain.
                </p>
                <p className={inter.className}>
                    &raquo; <a href={"https://chain.link/"} target={"_blank"}>Chainlink</a> automations execute time-based tasks in Nyxeum.
                </p>
                <p className={inter.className}>
                    &raquo; All the NFT images have been generated by <a href={"https://playgroundai.com/"} target={"_blank"}>Playground AI</a>.
                </p>
            </div>
        </>
    )
};

export default Whitepaper;
