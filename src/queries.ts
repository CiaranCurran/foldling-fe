import { gql } from '@apollo/client'

export const GET_WORDS = gql`
    query GetWords($user: String) {
        words(user: $user) {
            user
            word
            learning
            known
            ignore
            impressions
        }
    }
`

export const ADD_WORD = gql`
    mutation AddWord(
        $user: String!
        $word: String!
        $learning: Boolean
        $known: Boolean
        $ignore: Boolean
        $impressions: Int
    ) {
        addWord(
            user: $user
            word: $word
            learning: $learning
            known: $known
            ignore: $ignore
            impressions: $impressions
        ) {
            user
            word
            learning
            known
            ignore
            impressions
        }
    }
`

export const SET_KNOWN = gql`
    mutation SetKnown($word: String!, $user: String!) {
        setKnown(word: $word, user: $user) {
            user
            word
            learning
            known
            impressions
            ignore
        }
    }
`

export const SET_IGNORE = gql`
    mutation SetIgnore($word: String!, $user: String!) {
        setIgnore(word: $word, user: $user) {
            user
            word
            learning
            known
            impressions
            ignore
        }
    }
`
