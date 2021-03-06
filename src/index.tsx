import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
} from '@apollo/client'
import { GRAPHQL_URL } from './constants.ts'
/* polyfills.js */

import 'react-app-polyfill/ie11'
import 'core-js/features/array/find'
import 'core-js/features/array/includes'
import 'core-js/features/number/is-nan'

const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache(),
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
