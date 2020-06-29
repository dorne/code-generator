exports.testConnection = async function () {
  console.log('mysql testConnection');
  /*global dorne_code_gen*/
  /*eslint no-undef: "error"*/
  const sequelize = new dorne_code_gen.Sequelize(
    '',
  );
  let res = 'Unable to connect to the database';
  try {
    await sequelize.authenticate();
    res = null;
  } catch (error) {
    res = error;
    sequelize.close()
  }
  return res;
};

exports.getTables = function () {
  console.log('mysql getTables');
};

exports.getColumns = function () {
  console.log('mysql getColumns');
};
