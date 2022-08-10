import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import  AddressList  from './components/addresses';
import './App.css';

const GET_ADDRESS = gql`
  query address($addressParam: AddressInput){
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

export default function AddressSearch() {
  const [country, setCountry] = useState('');
  const [postcode, setPostCode] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [
    address, 
    { loading, error, data }
  ] = useLazyQuery(GET_ADDRESS, {
    variables: { addressParam: { country , postcode} },
    fetchPolicy: 'network-only',
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
        <button onClick={() => { country && postcode  && address().then(()=>setRefetch(true))}}>
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
      <AddressList refetch={ refetch } />
    </div>
  );
}
