const inquire = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const figlet = require('figlet');
const { prompt } = require('inquirer');

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

    const sql=`SELECT departments.id AS ID, departments.name AS Department FROM departments`;

    db.query(sql, (err, rows)=>{
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

getRoles=()=>{
    log('Showing all roles.');
    log('');

    const sql = `SELECT roles.id AS Id, roles.title AS Title, roles.salary AS Salary, departments.name AS Department
                 FROM roles
                 INNER JOIN departments ON roles.department_id = departments.id`;

    db.query(sql, (err, rows)=>{
        if(err) throw err;
        console.table(rows);
        promptUser();
    })
};

getEmployees=()=>{
    log('');
    log('Showing all employees');
    log('');

    const sql = `SELECT employees.id AS Id, CONCAT (employees.first_name," ", employees.last_name) AS Name, roles.title AS Position, departments.name AS Department, roles.salary AS Salary, CONCAT (manager.first_name, " ", manager.last_name) AS Manager
                 FROM employees
                 LEFT JOIN roles ON employees.role_id = roles.id
                 LEFT JOIN departments ON roles.department_id=departments.id
                 LEFT JOIN employees manager ON employees.manager_id=manager.id`

    db.query(sql, (err, rows)=>{
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
};

addDepartments=()=>{
    inquire.prompt([
        {
            name:'Department',
            type:"input",
            message: "Enter the name of the Department you would like to add. (required)",
            validate: deptInput =>{
                if (deptInput){
                    return true;
                } else {
                    console.log('Please enter the departments name.');
                    return false;
                }
            }
        }
    ])
    .then(answer =>{
        const sql =`INSERT INTO departments (name)
                    VALUES (?)`;
        
        db.query(sql, answer.Department, (err, result)=>{
        if (err) throw err;
        console.log("The Department named " + answer.Department+ " was successfully added!");
        console.log('');

        getDepartments();
        })
    })
};

addRoles=()=>{
    inquire.prompt([
        {
            type: 'input',
            name: 'title',
            message:'Enter the name of the role.',
            validate: titleInput =>{
                if (titleInput){
                    return true;
                } else {
                    console.log('Please enter the roles name.');
                    return false;
                }
            }
        },
        {
            type:'input',
            name:'salary',
            message:"Please enter the salary of the role.",
            validate: salaryInput=>{
                if(isNaN(salaryInput)){
                    return "Please enter a number";
                }
                return true;
            }
        }
    ])
    .then(answers=>{
        const info =[answers.title, answers.salary];
        const deptSql = `SELECT id, name FROM departments`;

        db.query(deptSql, (err, rows)=>{
            if(err) throw err;

            const dept = rows.map(({id, name})=>({value: id, name:name}));
            
            inquire.prompt([
                {
                    type: 'list',
                    name:'deptList',
                    message: 'Select the Department the role belongs too.',
                    loop: false,
                    choices: dept
                }
            ])
            .then(deptchoice =>{
                const dept= deptchoice.deptList;
                info.push(dept);

                const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES(?,?,?)`;

                db.query(sql, info, (err, rows)=>{
                    if (err) throw err;
                    log('Role succesfully added!');

                    getRoles();
                });
            });
        });
        
    });

};

addEmployees=()=>{
    inquire.prompt([
        {
            type: 'input',
            name:'employeeID',
            message:'Enter the ID number of the new employee.',
            validate: idInput=>{
                if(isNaN(idInput)){
                    return "Please enter an ID.";
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name",
            validate: nameInput =>{
                if (nameInput){
                    return true;
                } else {
                    console.log('Please enter the first name of the employee.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name",
            validate: nameInput =>{
                if (nameInput){
                    return true;
                } else {
                    console.log('Please enter the last name of the employee.');
                    return false;
                }
            }
        },
    ])
    .then(answers =>{
        const params = [answers.employeeID, answers.firstName, answers.lastName];
        const sql = `SELECT id, title FROM roles`;
        db.query(sql, params, (err, rows)=>{
            if (err) throw err;
            const roles=rows.map(({id, title})=>({value:id, name:title}));

            inquire.prompt([
                {
                    type:'list',
                    name:'roleinput',
                    message:'Select the role of the employee.',
                    loop: false,
                    choices: roles
                }
            ])
            .then(answer=>{
                params.push(answer.roleinput);
                const manSql = `SELECT id, CONCAT (first_name," ",last_name) AS name FROM employees`;

                db.query(manSql, params, (err, rows)=>{
                    if (err) throw err;
                    const manager = rows.map(({id, name})=>({value: id, name: name}));

                    inquire.prompt([
                        {
                            type:'confirm',
                            name:'confirmManager',
                            message:'Does this employee have a manager?',
                            default: false
                        },
                        {
                            type:'list',
                            name:'manager',
                            message: 'Select the manager the employee is assigned to.',
                            loop: false,
                            choices:manager,
                            when:({confirmManager})=>{
                                if(confirmManager === true){
                                    return true;
                                } else{
                                    return false;
                                }
                            },
                        }
                    ])
                    .then(answer=>{
                        params.push(answer.manager);

                        employeeSql = `INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
                                      VALUES(?,?,?,?,?)`;
                        db.query(employeeSql, params, (err, rows)=>{
                            if(err) throw err;

                            log('Employee successfully added!');
                            getEmployees();
                        })
                    });
                });
            });
        });
    });
};

editEmployeeRole=()=>{
    const employeeSql = `SELECT id, CONCAT (first_name," ",last_name) AS name FROM employees`;

    db.query(employeeSql, (err, rows)=>{
        if (err) throw err;
        const employees = rows.map(({id, name})=>({value: id, name: name}));

        inquire.prompt([
            {
                type: 'list',
                name:'choice',
                message:'Pick the employee you would like to edit.',
                loop: false,
                choices: employees
            }
        ])
        .then(answer=>{
            let params = [answer.choice];

            const roleSql = ` SELECT id, title FROM roles`;
            db.query(roleSql, (err, rows)=>{
                if (err) throw err;
                const roles = rows.map(({id, title})=>({value: id, name:title}));

                inquire.prompt([
                    {
                        type:'list',
                        name:'newRole',
                        message:'Select the new role for this employee.',
                        loop: false,
                        choices: roles,
                    }
                ])
                .then(answer=>{
                    params.unshift(answer.newRole);

                    newRoleSql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                    db.query(newRoleSql, params, (err, rows)=>{
                        if(err) throw err;
                        log('New roles succesfully assigned!');

                        getEmployees();
                    })
                })
            })
        })
    })
};

editEmployeeManager=()=>{
    const employeeSql = `SELECT id, CONCAT (first_name," ",last_name) AS name FROM employees`;

    db.query(employeeSql, (err, rows)=>{
        if (err) throw err;
        const employees = rows.map(({id, name})=>({value: id, name: name}));

        inquire.prompt([
            {
                type: 'list',
                name:'choice',
                message:'Pick the employee you would like to edit.',
                loop: false,
                choices: employees
            },
            {
                type: 'list',
                name:'manager',
                message:'Pick the new manager you would like to assign to this employee.',
                loop: false,
                choices: employees
            }
        ])
        .then(answers=>{
            const params = [answers.manager, answers.choice];
            const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;

            db.query(sql, params, (err, rows)=>{
                if(err) throw err;
                log("Employee's manager successfully updated!");

                getEmployees();
            })
        })
    })
};

employeesByManager=()=>{
    const managerSql = `SELECT id, CONCAT (first_name," ",last_name) AS name FROM employees`;

    db.query(managerSql, (err, rows)=>{
        if (err) throw err;
        const managers = rows.map(({id, name})=>({value: id, name: name}));

        inquire.prompt([
            {
                type:'list',
                name:'managers',
                message:"Select which manager's employees you would like to view.",
                loop: false,
                choices: managers
            }
        ])
        .then(answer=>{
            const sql = `SELECT employees.id AS Id, CONCAT (employees.first_name," ", employees.last_name) AS Name, roles.title AS Position, departments.name AS Department, roles.salary AS Salary, CONCAT (manager.first_name, " ", manager.last_name) AS Manager
                        FROM employees 
                        LEFT JOIN roles ON employees.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id=departments.id
                        LEFT JOIN employees manager ON employees.manager_id=manager.id
                        WHERE employees.manager_id = ?`
            const params = [answer.managers];

            db.query(sql, params,(err, rows)=>{
                if(err) throw err;
                log('');
                log('Viewing employees assigned to selected manager');
                log('');
                console.table(rows);
                promptUser();
            })
        })
    })
};

employeesByDepartment=()=>{
    const deptsql=`SELECT departments.id AS ID, departments.name AS Department FROM departments`;

    db.query(deptsql, (err, rows)=>{
        if (err) throw err;
        const departments = rows.map(({ID, Department})=>({value: ID, name:Department}));

        inquire.prompt([
            {
                type:'list',
                name:'departments',
                message:"Select which department's employees you would like to view.",
                loop:false,
                choices: departments,
            }
        ])
        .then(answer=>{
            const sql = `SELECT employees.id AS Id, CONCAT (employees.first_name," ", employees.last_name) AS Name, roles.title AS Position
                        FROM employees 
                        LEFT JOIN roles ON employees.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id=departments.id
                        WHERE roles.department_id = ?`
            const params = [answer.departments]
            db.query(sql, params, (err, rows)=>{
                if(err) throw err;
                log('');
                log('Viewing employees by selected department.');
                log('');
                console.table(rows);
                promptUser();
            })
        })
    });
};

deleteDepartment=()=>{
    const deptSql = `SELECT departments.id AS ID, departments.name AS Department FROM departments`;

    db.query(deptSql, (err, rows)=>{
        if (err) throw err;
        const departments = rows.map(({ID, Department})=>({value: ID, name:Department}));

        inquire.prompt([
            {
                type:'list',
                name:'deleteDept',
                message:'Select the Department you would like to delete.',
                loop: false,
                choices: departments
            }
        ])
        .then(answer=>{
            const sql =`DELETE FROM departments WHERE id = ?`;
            const params = [answer.deleteDept];

            db.query(sql, params, (err, rows)=>{
                if (err) throw err;
                log('');
                log('Department Successfully Deleted!')
                log('');
                getDepartments();
            })
        })
    })
};

deleteRole=()=>{
    const roleSql =`SELECT id, title FROM roles`;

    db.query(roleSql,(err,rows)=>{
        if(err) throw err;
        const roles = rows.map(({id, title})=>({value:id, name:title}));

        inquire.prompt([
            {
                type:'list',
                name:'roleList',
                message:'Select which role should be deleted.',
                loop: false,
                choices: roles
            }
        ])
        .then(answer=>{
            const sql = `DELETE FROM roles WHERE id = ?`
            const params = [answer.roleList];

            db.query(sql, params, (err, rows)=>{
                if (err) throw err;
                log('');
                log('Role succesfully deleted');
                log('');
                getRoles();
            })
        })
    })
}