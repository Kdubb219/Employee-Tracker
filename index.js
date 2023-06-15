const inquirer = require('inquirer');

const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

const levelq1 = [
    {
        name: 'menu1',
        type: 'list',
        choices: ['View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit'],
        message: 'what would you like to do?'

    }
];
const departmentadd = [
    {
        name: 'department',
        message: 'What is the name of the department?'
    }
];


function getRoles(callback) {
    //return [{ name: 'Manager', value: 1 }];
    pool.query('select id, title from employees_db.role', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(null);
            return;
        }

        const roles = results.map(row => ({
            name: row.title,
            value: row.id
        }));

        callback(roles);
    });
}

function getDepartments(callback) {
    pool.query('select id, name from employees_db.department', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            callback(null);
            return;
        }

        const departments = results.map(row => ({
            name: row.name,
            value: row.id
        }));

        callback(departments);
    });
}

function promptAction() {
    inquirer.prompt(levelq1).then(answer => {
        if (answer.menu1 == 'View All Employees') {
            pool.query('SELECT * FROM employees_db.employee', (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return;
                }
                console.table(results);
                promptAction();
            })
        }
        if (answer.menu1 == 'View All Roles') {
            pool.query('SELECT * FROM employees_db.role', (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return;
                }
                console.table(results);
                promptAction();
            })
        }
        if (answer.menu1 == 'View All Departments') {
            pool.query('SELECT * FROM employees_db.department', (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return;
                }
                console.table(results);
                promptAction();
            })
        }
        if (answer.menu1 == 'Add Employee') {
            addEmployee();
        }
        if (answer.menu1 == 'Add Department') {
            addDepartment();
        }
        if(answer.menu1 == 'Add Role') {
            addRole();
        }

        if (answer.menu1 == 'Quit') {
            process.exit();
        }
    })
    //connection.release();
}

function addEmployee() {
    getRoles((roles) => {
        const employeeadd =
            [{ name: 'firstname', message: 'employee first name' },

            { name: 'lastname', message: 'employee last name' },
            {
                name: 'role',
                type: 'list',
                choices: roles,
                message: 'What is your role?'
            }
            ];

        inquirer.prompt(employeeadd).then(answer => {
            const employee = {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.role
            };

            pool.query('insert into employees_db.employee set ?', employee, (error, results) => {
                if(error) { console.error('Error executing query:', error); return; }
                console.log('employee inserted in successfully');
                promptAction();
            });

        });
    });
}
function addRole() {
    getDepartments((departments) => {

        const roleadd = [
            {
                name: 'role',
                message: 'What is the name of the role?'
            },
            {
                name: 'department',
                type: 'list',
                choices: departments,
                message: 'What department is this role in?'
            }
        ];

        inquirer.prompt(roleadd).then(answer => {
            pool.query('insert into employees_db.role (title, department_id) values (?,?)', [answer.role, answer.department], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    return;
                }
                console.log('role inserted in successfully');
                promptAction();
            });
        });
    });
    
}
function addDepartment() {
    inquirer.prompt(departmentadd).then(answer => {
        pool.query('insert into employees_db.department (name) values (?)', answer.department, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return;
            }
            console.log('department inserted in successfully');
            promptAction();
        })
    })
}
promptAction();