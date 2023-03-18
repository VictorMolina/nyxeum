import React, { useState } from "react";
import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { ConnectButton } from '@rainbow-me/rainbowkit';
import SectionWrapper, {SectionCodes} from "@/components/SectionWrapper";

const inter = Inter({ subsets: ['latin'] })

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getSession(context);
  const token = await getToken({ req: context.req });

  const address = token?.sub ?? null;
  // If you have a value for "address" here, your
  // server knows the user is authenticated.

  // You can then pass any data you want
  // to the page component here.
  return {
    props: {
      address,
      session,
    },
  };
};

type AuthenticatedPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function AuthenticatedPage({ address }: AuthenticatedPageProps) {

  const [sectionCode, setSectionCode] = useState(SectionCodes.GAME);

  return (
    <>
      <Head>
        <title>Nyxeum Game</title>
        <meta name="description" content="Character Sheet Generator Dapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.description}>
          <p className={inter.className}>
            Nyxeum / Genesis / v1.0.0
          </p>
          <div>&nbsp;</div>
          <ConnectButton showBalance={false} />
        </div>

        <SectionWrapper sectionCode={sectionCode} />

        <div className={styles.grid}>

          <a
            onClick={() => setSectionCode(SectionCodes.GAME)}
            className={styles.card}
          >
            <h2 className={inter.className}>
              The Story <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about the history surrounding the world of Nyxeum.
            </p>
          </a>

          <a
            onClick={() => setSectionCode(SectionCodes.TECH)}
            className={styles.card}
          >
            <h2 className={inter.className}>
              The Tech <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Understand Nyxeum from a technical point of view.
            </p>
          </a>

          <a
            onClick={() => setSectionCode(SectionCodes.WHITEPAPER)}
            className={styles.card}
          >
            <h2 className={inter.className}>
              Whitepaper <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Read the vision that made us carry out the project.
            </p>
          </a>

          <a
            onClick={() => setSectionCode(SectionCodes.PLAY)}
            className={styles.card}
          >
            <h2 className={inter.className}>
              Play <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Connect your wallet and play to Nyxeum!
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
