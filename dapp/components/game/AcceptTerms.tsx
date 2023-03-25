import React from "react";

import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Image from "next/image";
import { useAcceptTerms } from "@/components/utils/NyxEssenceHooks";

const inter = Inter({ subsets: ['latin'] })

const AcceptTerms = () => {

    const acceptTerms = useAcceptTerms();

    return (
        <>
            <h1 className={[styles.title, inter.className].join(" ")}>Play to Nyxeum</h1>
            <div className={styles.section}>
                <div className={["grid-element", styles.section_image].join(" ")}>
                    <Image src="/images/nyx-tokens.png" alt="NYX tokens advice" width="256" height="256" priority={true} />
                </div>
                <div>
                    <p className={inter.className}>
                        Warning! Nyxeum is a dangerous place! Your NYX tokens will be managed by the Nyxeum Smart Contract in
                        order to simulate combats! You have a chance to win but also to lose them! Play safe!
                    </p>
                    <br/>
                    <p className={inter.className}>
                        If you are still up to enter to Nyxeum click on the &quot;Accept Terms&quot; button.
                    </p>
                    <br/>
                    <button onClick={() => acceptTerms?.write?.()}>ACCEPT TERMS</button>
                </div>
            </div>
        </>
    );
};

export default AcceptTerms;
