import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig, createClient, configureChains, goerli } from 'wagmi'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import {
    RainbowKitSiweNextAuthProvider,
    GetSiweMessageOptions,
} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';

const { chains, provider } = configureChains(
    [goerli],
    [alchemyProvider({ apiKey: 'dixigcmCcF0sH6Tzan41Q7Gp5IUgyMOh' }), publicProvider()],
)

const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
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

export default function App({ Component, pageProps }: AppProps) {
  return (
      <WagmiConfig client={wagmiClient}>
          <SessionProvider refetchInterval={0} session={pageProps.session}>
              <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
                  <RainbowKitProvider chains={chains} theme={darkTheme()}>
                      <Component {...pageProps} />
                  </RainbowKitProvider>
              </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
      </WagmiConfig>
  )
}
