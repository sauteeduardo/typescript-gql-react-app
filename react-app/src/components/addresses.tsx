import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';


interface Address {
    postcode: string;
    state: string;
    placename: string;
} 
  
interface SearchAddress {
  searchAddress: Address[] | [];
}

const GET_ADDRESSES = gql`
  query {
    searchAddress {
      postcode
      placename
      state
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
  useEffect(() => {_.refetch && refetch();}, [_])
  
  
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
              <th>City</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
          {items && items.searchAddress && items.searchAddress.map(address => (

            <tr>
              <td> {address.postcode} </td>
              <td>{address.placename}</td>
              <td>{address.state}</td>
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