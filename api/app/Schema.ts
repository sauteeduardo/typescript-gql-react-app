import { gql } from "apollo-server-express"; //will create a schema
const Schema = gql`
  type Query {
    address(country: String, postcode: String): Address
    searchAddress : [Address]
  }
  type Mutation {
    clearSearch : String
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
