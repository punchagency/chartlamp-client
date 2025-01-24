'use client';

import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';

export const apiUrl = process.env.NEXT_PUBLIC_APP_SERVER;

function makeClient() {
    const httpLink = new HttpLink({
        uri: `${apiUrl}/graphql`,
        credentials: 'include',
        fetchOptions: {
            credentials: 'include',
        },
    });

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        cache: new InMemoryCache(),
        link: httpLink,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return <ApolloProvider client={makeClient()}>{children}</ApolloProvider>;
}
