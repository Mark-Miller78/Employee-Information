const inquire = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

require('dotenv').config();

//connect to database

const db = mysql.createConnection(
    {
        host: 'localhose',
        user:'root',
        password:process.env.DB_PW,
        database: 'roster'
    },
    console.log('Connected to the roster database')
);