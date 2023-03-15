import Image from 'next/image'
import { Inter } from "next/font/google";
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

const Game = () => {
    return (
        <>
            <h1 className={[styles.title, inter.className].join(" ")}>The Nyx Tribute</h1>
            <div className={styles.section}>
                <div className={["grid-element", styles.section_image].join(" ")}>
                    <Image src="/images/nyxeum.png" alt="Nyxeum" width="256" height="256" priority={true} />
                </div>
                <div>
                    <p className={inter.className}>
                        For thousands of years the inhabitants of Nyxeum have fought among themselves to obtain eternal life.
                        Time passes quickly in this universe where the only way to survive is to drain the energy from living
                        bodies. Some have grouped into clans to ensure their existence, although it is difficult to trust
                        others.
                    </p>
                    <br/>
                    <p className={inter.className}>
                        Every night a moan is heard that fills every corner of this universe. They all pay tribute to Nyx,
                        the goddess of the night, who drains their lives. Everything seems to be a game of gods, although not
                        everyone is willing to accept it.
                    </p>
                    <br/>
                    <p className={inter.className}>
                        There is a limited amount of energy in Nyxeum. Each time a life is born a small part of it is
                        borrowed from the Orb of Nyx and is expected to be invested wisely.
                    </p>
                    <br/>
                    <p className={inter.className}>
                        Gather Nyx energy and survive.
                    </p>
                </div>
            </div>
        </>
    )
};

export default Game;
