import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import  AddressList  from './components/addresses';
const GET_ADDRESS = gql`
  mutation address($addressParam: AddressInput){
    address(addressParam: $addressParam){
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


interface AddressInfo {
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


interface AddressInput {
  country: string;
  postcode: string;
}

export default function AddressSearch() {
  const [country, setCountry] = useState('');
  const [postcode, setPostCode] = useState('');

  const [address, {loading, error, data }] = useMutation<
    { address: AddressInfo },
    { addressParam: AddressInput }
  >(GET_ADDRESS, {
    variables: { addressParam: { country , postcode} } 
  });
  
  return (
    

    <div>
      {error ? <p>Oh no! {error.message}</p> : null}
        <p>
          <label>Country</label>
          <input
            name="country"
            onChange={e => setCountry(e.target.value)}
          />
        </p>
        <p>
          <label>postal code</label>
          <input
            name="postcode"
            onChange={e => setPostCode(e.target.value)}
          />
        </p>
        <button onClick={() => country && postcode && address()}>
          Search
        </button>
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
            <tr>
              <td> {data?.address.postcode} </td>
              <td> {data?.address.country}</td>
              <td> {data?.address.countryabbreviation}</td>
              <td>{data?.address.places[0].placename}</td>
              <td>{data?.address.places[0].longitude}</td>
              <td>{data?.address.places[0].state}</td>
              <td>{data?.address.places[0].stateabbreviation}</td>
              <td>{data?.address.places[0].latitude}</td>
            </tr>
          </tbody>
        </table>
      )}
      <AddressList />
    </div>
  );
}
