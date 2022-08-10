import { gql } from "apollo-server-express"; //will create a schema
const Schema = gql`
  type Query {
    searchAddress : [AddressSearch]
    address(addressParam: AddressInput): Address
  }
  type Mutation {
    clearSearch : String
  }

  input AddressInput {
    country: String
    postcode: String
  }

  type AddressSearch {
    postcode: String
    state: String
    placename: String
  }
     
  type Address {
    postcode: String
    country: String
    countryabbreviation: String
    places: [Place]
  }

  type Place {
    placename: String
    longitude: String
    state: String
    stateabbreviation: String
    latitude: String
  }
`;
export default Schema; 
