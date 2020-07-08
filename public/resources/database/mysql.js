exports.testConnection = async function (uri) {
  console.log('mysql testConnection');
  /*global dorne_code_gen*/
  /*eslint no-undef: "error"*/
  const sequelize = new dorne_code_gen.Sequelize(uri);
  let res = 'Unable to connect to the database';
  try {
    await sequelize.authenticate();
    res = null;
  } catch (error) {
    res = error.message;
    sequelize.close();
  }
  return res;
};

exports.getTables = async function (uri) {
  const sequelize = new dorne_code_gen.Sequelize(uri);
  let db = uri.split('/');
  db = db[db.length - 1];

  const tables = await sequelize.query(
    `select TABLE_COMMENT as comment, TABLE_NAME as name from information_schema.tables where table_schema='${db}' and table_type='base table';`,
    { type: sequelize.QueryTypes.SELECT },
  );
  return tables;
};

exports.getColumns = async function (uri, table) {
  const sequelize = new dorne_code_gen.Sequelize(uri);
  let db = uri.split('/');
  db = db[db.length - 1];

  const tables = await sequelize.query(
    // `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${db}' AND TABLE_NAME='${table}';`,
    `SELECT COLUMN_COMMENT as comment, COLUMN_NAME as name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='${db}' AND TABLE_NAME='${table}';`,
    { type: sequelize.QueryTypes.SELECT },
  );
  return tables;
};
