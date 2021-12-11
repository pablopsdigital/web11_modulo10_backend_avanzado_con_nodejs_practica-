'use strict';

// conexion a la base de datos
const dbConnection = require('../services/connectionBD_Mongo');

// modelo de agentes
const Advertisement = require('../models/Advertisement');
const User = require('../models/User');
const inicitalData = require('./mockData');

main().catch((err) => console.log('There was an error', err));

async function main() {
  await initAdvertisements();
  await initUsers();
  dbConnection.close();
}

async function initAdvertisements() {
  // Delete possible advertisements
  const deletedAdvertisements = await Advertisement.deleteMany();
  console.log(`Deleted ${deletedAdvertisements.deletedCount} advertisements.`);

  // Create mockData advertisement
  const advertisements = await Advertisement.insertMany(
    inicitalData.advertisement
  );
  console.log(`Create ${advertisements.length} advertisements.`);
}

async function initUsers() {
  // Delete possible users
  const deletedUsers = await User.deleteMany();
  console.log(`Deleted ${deletedUsers.deletedCount} users.`);

  // Create mockData users
  const result = await User.insertMany([
    {
      email: 'user@example.com',
      password: await User.hashPassword('1234'),
    },
    {
      email: 'pablo@admin.com',
      password: await User.hashPassword('123456'),
    },
  ]);
  console.log(`Create ${result.length} users.`);
}

module.exports = main;
