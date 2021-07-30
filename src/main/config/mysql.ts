import mysql from 'mysql'

export const MysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pa$$w0rd',
  database: 'zoho'
})
