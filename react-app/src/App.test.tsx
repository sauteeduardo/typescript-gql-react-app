import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
const { act } = require('react-test-renderer');

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});
test('renders learn react link', async () => {
  await act( async () => render(<ApolloProvider client={client}> <App /> </ApolloProvider>));
  const linkElement = screen.getByText(/State Abbreviation/i);
  expect(linkElement).toBeInTheDocument();
});
