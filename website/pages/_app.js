import Head from 'next/head'
import { Provider } from 'next-auth/client'
import { ChakraProvider } from '@chakra-ui/react'
import { PusherProvider } from '@harelpls/use-pusher'
import { GameProvider } from '../contexts/Game/GameContext'
import FontFace from '../components/FontFace'
import theme from '@kalabam/theme'

// Pusher Config
const config = {
  clientKey: process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: '/api/pusher/auth'
}

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='theme-color' content='#2A4365' />
      </Head>
      <Provider session={pageProps.session}>
        <ChakraProvider theme={theme}>
          <PusherProvider {...config}>
            <GameProvider>
              <Component {...pageProps} />
            </GameProvider>
          </PusherProvider>
        </ChakraProvider>
        <FontFace />
      </Provider>
    </>
  )
}

export default App
