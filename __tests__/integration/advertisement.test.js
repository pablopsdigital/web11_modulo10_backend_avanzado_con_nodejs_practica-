const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

// const dbConnection = require('../../services/connectionBD_Mongo');
// const server = require('../../bin/www');
// const { request } = require('express');

//===================================================================
//Create mock data
//===================================================================
const scriptLoadData = require('../../scripts/loadMockDataDB');
beforeEach(async () => {
  //Load data in database
  await scriptLoadData;
});

//===================================================================
//Avertisement endpoint test
//===================================================================
describe('Advertisement endpoint', () => {
  describe('GET /api/v1/advertisement', () => {
    it('Should return 2 advertisement', async () => {
      const res = await api.get('/api/v1/advertisement');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('results');
      expect(res.body.results).toHaveLength(8);
    });

    it('Return as json format', async () => {
      await api.get('/api/v1/advertisement').set('Authorization', token);
      expect(res.statusCode).toEqual(200);
      expect('Content-Type', /application\/json/);
    });

    it('Should return first advertisement name is Jones', async () => {
      await api.get('/api/v1/advertisement').set('Authorization', token);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('results');
      expect(res.body.results[0].name).toBe('Jones');
    });
  });

  describe('GET /api/v1/advertisement/:id', () => {
    it('Should return the advertisement with the specified id', async () => {
      const res = await api.get(
        '/api/v1/advertisement/61b473bbac82e5a5cc53b74e'
      );
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('results');
      expect(res.body.results[0]._id).toBe('61b473bbac82e5a5cc53b74e');
    });
  });

  describe('POST /api/v1/advertisement', () => {
    it('Should return a 201 Created advertisement', async () => {
      const res = await api
        .post('/api/v1/advertisement/add')
        .send({
          name: 'taza',
          sale: true,
          price: 54,
          tags: ['lifestyle'],
        })
        .set('Authorization', token);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('results');
      expect(res.body.results[0].name).toBe('taza');
    });
  });
});

// afterAll((done) => {
//   dbConnection.close();
//   server.close(done);
// });
