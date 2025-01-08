const connection = require('../DBconfig/Dbconfig');
const fs = require('fs');

async function install() {
  const queryfile = __dirname + '/sql/Database.sql';
  console.log(queryfile);
  let queries = [];
  let finalmessage = {};
  let templine = '';

  const linebyline = fs.readFileSync(queryfile, 'utf-8').split('\n');

  const executed = await new Promise((resolve, reject) => {
    linebyline.forEach((line) => {
      if (line.trim().startsWith('--') || line.trim() === '') {
        return;
      }
      templine = templine + line;
      if (line.trim().endsWith(';')) {
        const sqlquery = templine.trim();
        queries.push(sqlquery);
        templine = '';
      }
    });
    resolve('queries are added to the list');
  });

  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await connection.query(queries[i]);
      console.log('table is created');
      console.log(queries[i])
    } catch (err) {
      console.log(err)
      finalmessage.message = 'not all tables are created';
      break; // Exit the loop if an error occurs
    }
  }

  if (!finalmessage.message) {
    finalmessage.message = 'all tables created';
    finalmessage.status = 200;
  } else {
    finalmessage.status = 500;
  }

  return finalmessage;
}

module.exports = { install };