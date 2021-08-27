const inquirer = require('inquirer');
const Department = require('./lib/department.js');
const Role = require('./lib/role.js');
require('dotenv').config();
const cTable = require('console.table');
const nameArray = [];
// get the client

const mysql = require('mysql2');
const { async } = require('rxjs');

// create the connection to database


async function main(){
const pool =  mysql.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password : process.env.DB_PASSWORD,
  
  
});
// now get a Promise wrapped instance of that pool
return promisePool = pool.promise();
// query database using promises
} 

//}

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


const promptAddRole = async(nameArray) =>{ const newRole =  await inquirer.prompt([
    {
        type: 'input',
        name: 'title',
        message: "Enter the role title that you want to add : ",
      },
      {
        type: 'number',
        name: 'salary',
        message: "Enter the salary in that role : ",
      },
      {
        type: 'list',
message: 'Select the department where this role belongs',
name: 'request',
choices: nameArray
    }
]);
console.log("my input is ::::: "+newRole.name);
return newRole;
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
        console.log("It says view Employee Roles" + userRequest);
        await main();
        const role = await new Role();
        role.viewAllRoles(promisePool);
        console.log("bla role");
        break;

        case "Add Role" : 
        try{
        console.log("It says add Employee Role" + userRequest);
        //console.log("Connecton----"+connection.host);
        
            await main();
             const [rows,fields] = await promisePool.query(
                `SELECT name FROM department`); 
                  
           console.log(rows);
             
            const newRole = await promptAddRole(rows);
        
        const role = await new Role(newRole.title,newRole.salary,newRole.request);
            await role.addRole(promisePool);
            
        console.log("bla 2");
        break;
    }catch(err){
        console.error(err);
    }
        break;

        case "View All Departments" : {
        console.log("It says View All Departments" + userRequest);
        await main();
        const department = await new Department();
        department.viewDepartments(promisePool);
        console.log("bla bls");
        break;
        }

        case "Add Department" : 
        console.log("It says Add Department" + userRequest);
        
        try{
           await main();
            const newDepartmentName = await promptAddDepartment();
        
        const department = await new Department(newDepartmentName);
            await department.AddDepartment(promisePool);
            
        console.log("bla 2");
        break;
    }catch(err){
        console.error(err);
    }
  
        default : console.log("The request didn't match with any of the choices"); 

    }
}




const init = async() => {
    //const promisePool = await promisePool.main;
    promptUser()
    .then((userRequest) =>
       
        processUserRequest(userRequest)
    ) 
    .catch((error)=>{console.log(error)});
}

init();