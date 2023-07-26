import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "../context/AuthContext";
import "@fontsource/rubik/300.css";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const fonts = {
  heading: `'Rubik', sans-serif`,
  body: `'Rubik', monospace`,
};

const theme = extendTheme({ config, fonts });

const App = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/apple-touch-icon.png" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
