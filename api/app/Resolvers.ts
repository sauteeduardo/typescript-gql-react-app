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
        address: async (_: any, addressParams: any) => {
            let { country, postcode } = addressParams.addressParam;
            console.log('addressParams', country);
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
                let newAddr = <any>{};
                newAddr.postcode = data["postcode"];
                newAddr.placename = data.places[0]["placename"];
                newAddr.state = data.places[0].state;
                newAddress.push(newAddr);
                console.log('data', newAddress);
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
    },
    Mutation : {

        clearSearch : async (_:any) => {
            try {
                client.flush();
                return "cleared";
            } catch (error) {
                return error;
            }
        },
    }
};
export default Resolvers;
