const { Sequelize } = require('sequelize');

exports.testConnection = async function () {
  const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname'); // Postgres 示例
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

exports.getTables = function () {
  console.log('sqlite getTables');
};

exports.getColumns = function () {
  console.log('sqlite getColumns');
};
