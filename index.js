const inquirer = require('inquirer');
const Department = require('./lib/department.js');
require('dotenv').config();


// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password : process.env.DB_PASSWORD,
  
  
});

const promptUser = async() => {
    const userRequest = await inquirer.prompt([
        {
            type: 'list',
    message: 'What would you like to do',
    name: 'request',
    choices: ["View All Employees",
              "Add Employee",
              "Update Employee Role",
               "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department"
            ]
        }
    ]) 
    return userRequest.request;
}


const processUserRequest = async(userRequest) => {
    switch(userRequest){
        case "View All Employees" : 
        console.log("It says View All Employee" + userRequest);
        break;

        case "Add Employee" : 
        console.log("It says Add Employee" + userRequest);
        break;

        case "Update Employee Role" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "View All Roles" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "Add Role" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "View All Departments" : {
        console.log("It says View All Departments" + userRequest);
        const department = await new Department(8,"hhhh");
        department.viewDepartments();
        console.log("bla bls");
        connection.query(
            `SELECT * FROM department`,
            function(err, results, fields) {
              console.log(results); // results contains rows returned by server
              console.log(fields); // fields contains extra meta data about results, if available
            }
          );
        break;
        }

        case "Add Department" : 
        console.log("It says Add Department" + userRequest);
        break;

        default : console.log("The request didn't match with any of the choices"); 

    }
}




const init = async() => {
    promptUser()
    .then((userRequest) =>
        //console.log("fvdf"+userRequest);
        processUserRequest(userRequest)
    )
    .catch((error)=>{console.log(error)});
}

init();