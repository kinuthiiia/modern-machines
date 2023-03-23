import "../styles/globals.css";
import { createEmotionCache, MantineProvider } from "@mantine/core";

import { createClient, Provider } from "urql";
import { Notifications } from "@mantine/notifications";

export const client = createClient({
  url: "https://modern-machines.herokuapp.com/graphql",
});

function MyApp({ Component, pageProps }) {
  const myCache = createEmotionCache({
    key: "mantine",
    prepend: false,
  });

  return (
    <Provider value={client}>
      <MantineProvider
        withGlobalStyles
        emotionCache={myCache}
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          // fontFamily: "Prompt",
          fontWeight: "light",
          breakpoints: {
            sm: 500,
          },
        }}
      >
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </Provider>
  );
}

export default MyApp;
