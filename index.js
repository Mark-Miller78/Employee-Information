const inquire = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const figlet = require('figlet');

const log= console.log;

require('dotenv').config();

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user:'root',
        password: process.env.DB_PW,
        database: 'roster'
    },
);

db.connect(err=>{
    if (err) throw err;
    log('Connected to the roster database!');
    welcomeSign();
});

welcomeSign =()=>{
    log(`================================================================================================================`);
    log(``);
    log(``);
    log(figlet.textSync('Employee Information'));
    log(``);
    log(``);
    log(`================================================================================================================`);
}