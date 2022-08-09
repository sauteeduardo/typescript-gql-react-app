//Using axios to make the request
import axios from 'axios';

const { InMemoryDatabase } = require('in-memory-database');

const client = new InMemoryDatabase();


const Resolvers = {
    Query: {
        searchAddress: async (_: any) => {
            const Addresses = client.get('Address');

            return Addresses ? Addresses.slice(-5) : [];
        },
    },
    Mutation : {

        clearSearch : async (_:any) => {
            client.flush();
            return "cleared";
        },
        address: async (_: any, addressParams: any) => {
            let { country, postcode } = addressParams.addressParam;
            console.log(addressParams);
            
            if(country == ""){
                country = "us";
            }
            try {
                let { data } = await axios.get(
                    'http://api.zippopotam.us/'+country +'/'+ postcode,
                    {
                    headers: {
                        Accept: 'application/json',
                    },
                    },
                );
                // to fetch it right I had to change this values
                data.postcode = data["post code"];
                data.countryabbreviation = data["country abbreviation"];
                delete data["post code"];
                delete data["country abbreviation"];
                for (let key in data.places) {
                    data.places[key].placename = data.places[key]["place name"];
                    data.places[key].stateabbreviation = data.places[key]["state abbreviation"];
                    delete data.places[key]["state abbreviation"];
                    delete data.places[key]["place name"];
                }
                let newAddress = [];
                let Addresses = client.get('Address');
                if(Addresses){
                    newAddress = Addresses;
                }
                newAddress.push(data);
                
                client.set('Address', newAddress);
                
                
                return data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                  console.log('error message: ', error.message);
                  return error.message;
                } else {
                  console.log('unexpected error: ', error);
                  return 'An unexpected error occurred';
                }
            }
        },
    }
};
export default Resolvers;