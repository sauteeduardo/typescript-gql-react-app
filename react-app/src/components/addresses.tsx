import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';


interface Address {
    postcode: string;
    country: string;
    countryabbreviation: string;
    places: Place[];
} 
  
interface Place {
    placename : string;
    longitude : string;
    state : string;
    stateabbreviation : string;
    latitude : string;
}

interface SearchAddress {
  searchAddress: Address[] | [];
}

const GET_ADDRESSES = gql`
  query {
    searchAddress {
        postcode
        country
        countryabbreviation
        places {
            placename
            longitude
            state
            stateabbreviation
            latitude
        }
    }
  }
`;

const FLUSH_ADDRESS = gql`
  mutation {
    clearSearch
  }
`;

interface ClearReturn {
  clearSearch: string;
}



const AddressList = (_:any) => {
  const [items, setItems] = useState<SearchAddress>();
  const { loading, data, refetch} = useQuery<SearchAddress>(
    GET_ADDRESSES,
    { }
  );
  useEffect(() => {refetch();}, [_])
  
  
  useEffect(() => {setItems(data);}, [data])

  const [clearSearch, { error }] = useMutation<
    { clearSearch: ClearReturn },
    {  }
  >(FLUSH_ADDRESS, {
    variables: { } 
  });
  return (
    <div>
      <h3>Last 5 searches</h3>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Post code</th>
              <th>Country</th>
              <th>Country abbreviation</th>
              <th>City</th>
              <th>Longitude</th>
              <th>State</th>
              <th>State Abbreviation</th>
              <th>Latitude</th>
            </tr>
          </thead>
          <tbody>
          {items && items.searchAddress && items.searchAddress.map(address => (

            <tr>
              <td> {address.postcode} </td>
              <td> {address.country}</td>
              <td> {address.countryabbreviation}</td>
              <td>{address.places[0].placename}</td>
              <td>{address.places[0].longitude}</td>
              <td>{address.places[0].state}</td>
              <td>{address.places[0].stateabbreviation}</td>
              <td>{address.places[0].latitude}</td>
            </tr>
            ))}

          </tbody>
        </table>
      )}
      <button onClick={() => { clearSearch(); setItems(undefined); }}>
          Flush search
      </button>
      {error ? <p>Oh no! {error.message}</p> : null}
    </div>
  );
}

export default AddressList;