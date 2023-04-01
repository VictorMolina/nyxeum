import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi'
import { localhost } from "@wagmi/chains";

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import {
    RainbowKitSiweNextAuthProvider,
    GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';

const { chains, provider } = configureChains(
    [goerli, localhost],
    [alchemyProvider({ apiKey: 'dixigcmCcF0sH6Tzan41Q7Gp5IUgyMOh' }), publicProvider()],
)

const { connectors } = getDefaultWallets({
    appName: 'Nyxeum DApp',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
    statement: '*** Welcome to Nyxeum DApp ***',
});

const getBaseUrl = () => {
    switch (process.env.NEXT_PUBLIC_VERCEL_ENV) {
        case 'development':
            return process.env.NEXT_PUBLIC_VERCEL_URL;
        case 'preview':
            return process.env.NEXT_PUBLIC_VERCEL_URL;
        case 'production':
            return process.env.NEXT_PUBLIC_VERCEL_URL;
        default:
            return process.env.NEXTAUTH_URL;
    }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
      <WagmiConfig client={wagmiClient}>
          <SessionProvider refetchInterval={0} session={pageProps.session} baseUrl={getBaseUrl()}>
              <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
                  <RainbowKitProvider chains={chains} theme={darkTheme()}>
                      <Component {...pageProps} />
                  </RainbowKitProvider>
              </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
      </WagmiConfig>
  )
}
