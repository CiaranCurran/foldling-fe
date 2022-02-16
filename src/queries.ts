import { gql } from "@apollo/client";

export const GET_WORDS = gql`
  query {
    words {
      word
      learning
      known
      ignore
      impressions
    }
  }
`;

export const ADD_WORD = gql`
  mutation AddWord(
    $word: String!
    $learning: Boolean
    $known: Boolean
    $ignore: Boolean
    $impressions: Int
  ) {
    addWord(
      word: $word
      learning: $learning
      known: $known
      ignore: $ignore
      impressions: $impressions
    ) {
      word
      learning
      known
      ignore
      impressions
    }
  }
`;

export const SET_KNOWN = gql`
  mutation SetKnown($word: String!) {
    setKnown(word: $word) {
      word
      learning
      known
      impressions
      ignore
    }
  }
`;

export const SET_IGNORE = gql`
  mutation SetIgnore($word: String!) {
    setIgnore(word: $word) {
      word
      learning
      known
      impressions
      ignore
    }
  }
`;
