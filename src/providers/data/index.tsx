import graphqLDataprovider, { 
    GraphQLClient,
    liveProvider as graphqLLiveProvider
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = '${API_BASE_URL}/graphql'   // URL of the API
export const WS_URL = 'wss://api.crm.refine.dev/graphql' // URL of the websocket

export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options);
        } catch (error) {
            return Promise.reject(error);
        }
    },
})

export const wsClient: any = typeof window !== 'undefined'
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            const accessToken = localStorage.getItem('access_token');
            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
        },
    })
    : undefined;



export const dataProvider = graphqLDataprovider(client);
export const liveProvider = wsClient ? graphqLLiveProvider(wsClient): undefined