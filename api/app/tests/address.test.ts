import chai from 'chai';
const chaiGraphql = require('chai-graphql');

chai.use(chaiGraphql);

const { assert } = chai;
const baseUrl = "http://localhost:4000/graphql";
const request = require('supertest')(baseUrl);

const expect = chai.expect;

describe('testing Address search', () => {
    it('Should request the postcode api', (done) => {
        request
        .post('/')
        .send({
            query: "mutation{"+
                "address(addressParam: {country : \"us\", postcode: \"90210\"}){"+
                " postcode "+
                "  country"+
                "  countryabbreviation"+
                "  places {"+
                "    placename"+
                "    longitude"+
                "    state"+
                "    stateabbreviation"+
                "    latitude"+
                "  }"+
                "}"+
              "}"
        })
        .set("Accept", "application/json")
        .expect(200)
        .end((err:any, res:any)=> {
            if(err) return done(err);
            expect(res.body).to.be.a('object');
            const address = res.body.data.address;
            expect (address.country).to.be.equal("United States");
            done();
        });
    });
});