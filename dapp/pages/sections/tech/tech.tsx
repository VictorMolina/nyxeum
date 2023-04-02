import { Mermaid } from 'mdx-mermaid/lib/Mermaid'
import { Inter } from "next/font/google";
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] })

const Tech = () => {
    return (
        <>
            <h1 className={[styles.title, inter.className].join(" ")}>Architecture and Tech Stack</h1>
            <div>
                <p className={inter.className}>
                    Solidity v0.8.9 /
                    Next.js v13.2.1 /
                    Hardhat v2.13.0 /
                    Ethers v5.7.2 /
                    Rainbowme v0.11.0
                </p>
                <br/>
            </div>
            <div className={[styles.mono_section, styles.mermaid_chart].join(" ")}>
                <Mermaid
                    key={`tech`}
                    config={{mermaid: {theme: 'dark'}}}
                    chart={`
                        graph LR
                        
                        subgraph Web Client
                            NFTI["nft/images"]
                            WAGMI["Wagmi"]
                        end
    
                        subgraph Ethereum
                            NYX["NYX\n(ERC20)"]
                            HON["Heroes of Nyxeum\n(ERC721)"]
                            PXC["Proxy\n(smart contract)"]
                            SMC["Nyxeum v1.0.0\n(smart contract)"]
                        end
                        
                        subgraph Chainlink
                            CLA["Custom Logic Automation"]
                        end
                        
                        subgraph PlaygroundAI
                            PGAI["AI Text-to-Image generator"]
                        end
                        
                        WAGMI-. json-rpc .->NYX
                        WAGMI-. json-rpc .->HON
                        WAGMI-. json-rpc .->PXC-. delegatecall .->SMC
                        PGAI-. "store image" .->NFTI
                        CLA-. checkUpkeep .->PXC
                        CLA-. performUpkeep .->PXC
                    `} />
            </div>
        </>
    )
};

export default Tech;
