/***
 * 测试连接
 */
exports.testConnection = async function (uri) {
  console.log('sqlite testConnection');
  /*global dorne_code_gen*/
  /*eslint no-undef: "error"*/
  const sequelize = new dorne_code_gen.Sequelize(uri);
  let res = 'Unable to connect to the database';
  try {
    await sequelize.authenticate();
    res = null;
  } catch (error) {
    res = error;
    sequelize.close();
  }
  return res;
};

/***
 * 获取表
 */
exports.getTables = async function (uri) {
  const sequelize = new dorne_code_gen.Sequelize(uri);
  
  const tables = await sequelize.query(
    `SELECT name as name, tbl_name as comment FROM sqlite_master where type='table' order by name`,
    { type: sequelize.QueryTypes.SELECT },
  );
  sequelize.close();
  return tables;
};

/***
 * 获取列
 */
exports.getColumns = async function (uri, table) {
  const sequelize = new dorne_code_gen.Sequelize(uri);
  
  const columns = await sequelize.query(
    `SELECT * FROM PRAGMA_TABLE_INFO('${table}');`,
    { type: sequelize.QueryTypes.SELECT },
  );
  sequelize.close();
  return columns;
};
