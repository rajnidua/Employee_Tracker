const inquirer = require('inquirer');
const Department = require('./lib/department.js');
require('dotenv').config();
const cTable = require('console.table');

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

const promptAddDepartment = async() =>{ const newDepartmentName =  await inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "Enter the department name that you want to add : ",
      }
]);
console.log("my input is ::::: "+newDepartmentName.name);
return newDepartmentName.name;
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
        const department = await new Department();
        department.viewDepartments(connection);
        console.log("bla bls");
        break;
        }

        case "Add Department" : 
        console.log("It says Add Department" + userRequest);
        
        try{
           
            const newDepartmentName = await promptAddDepartment();
        
        const department = await new Department(newDepartmentName);
            await department.AddDepartment(connection);
            
        console.log("bla 2");
        break;
    }catch(err){
        console.error(err);
    }
  
        default : console.log("The request didn't match with any of the choices"); 

    }
}




const init = async() => {
    promptUser()
    .then((userRequest) =>
       
        processUserRequest(userRequest)
    )
    .catch((error)=>{console.log(error)});
}

init();