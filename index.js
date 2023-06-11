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
]
const employeeadd = [
    {
        name: 'firstname',
        message: 'employee first name'
    },
    {
        name: 'lastname',
        message: 'employee last name'
    },
    {
        name: 'role',
        type: 'list',
        choices: getRoles(),//[{name:'Manager',id:1 }],
        message: 'What is your role?'
    }
]
const departmentadd = [
    {
        name: 'department',
        message: 'What is the name of the department?'
    }
]


function getRoles() {
    return [{ name: 'Manager', value: 1 }];
    // pool.query('select id, title from employees_db.role order by title', (error,results)=>{
    //     if (error) {
    //         console.error('Error executing query:', error);
    //         return;
    //       }
    //     const eroles = results.map(row=>({
    //         name: row.title,
    //         value: row.id
    //     }));
    //     //console.log(eroles);
    //     return eroles;
    // });
    //connection.release();
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

        if (answer.menu1 == 'Quit') {
            process.exit();
        }
    })
    //connection.release();
}

function addEmployee() {
    inquirer.prompt(employeeadd).then(answer => {
        const employee = {
            first_name: answer.firstname,
            last_name: answer.lastname,
            role_id: answer.role.value
        };
        pool.query('insert into employees_db.employee set ?', employee, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return;
            }
            console.log('employee inserted in successfully');
            promptAction();
        })
        //connection.release();
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