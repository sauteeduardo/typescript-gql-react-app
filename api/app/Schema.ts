import { gql } from "apollo-server-express"; //will create a schema
const Schema = gql`
  type Query {
    searchAddress : [Address]
  }
  type Mutation {
    address(addressParam: AddressInput): Address
    clearSearch : String
  }

  input AddressInput {
    country: String
    postcode: String
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
