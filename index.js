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
    promptUser();
}

function promptUser() {
    inquire.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Please select an action from the provided list.',
            loop: false,
            choices: ['View all departments',
                      'View all roles',
                      'View all employees',
                      'Add a department',
                      'Add a role',
                      'Add an employee',
                      'Update an employee role',
                      'Update an employees manager',
                      'View employees by manager',
                      'View employees by department',
                      'Delete a Department',
                      'Delete a role',
                      'Delete an employee',
                      'View department budgets',
                      'Exit'
                    ]
        }
    ])
        .then((answer)=>{
            const {choices} = answer;

            if(choices === 'View all departments'){
                getDepartments();
            }

            if(choices === 'View all roles'){
                getRoles();
            }

            if(choices === 'View all employees'){
                getEmployees();
            }

            if(choices === 'Add a department'){
                addDepartments();
            }

            if(choices === 'Add a role'){
                addRoles();
            }

            if(choices === 'Add an employee'){
                addEmployees();
            }

            if(choices === 'Update an employee role'){
                editEmployeeRole();
            }

            if(choices === 'Update an employees manager'){
                editEmployeeManager();
            }

            if(choices === 'View employees by manager'){
                employeesByManager();
            }

            if(choices === 'View employees by department'){
                employeesByDepartment();
            }

            if(choices === 'Delete a Department'){
                deleteDepartment();
            }

            if(choices === 'Delete a role'){
                deleteRole();
            }

            if(choices === 'Delete an employee'){
                deleteEmployee();
            }

            if(choices === 'View department budgets'){
                departmentBudgets();
            }

            if(choices === 'Exit'){
                exit();
            };
        });
};

getDepartments=()=>{
    log('Showing all Departments');

    const sql=`SELECT departments.id AS id, departments.name AS department FROM departments`;

    db.query(sql, (err, rows)=>{
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};