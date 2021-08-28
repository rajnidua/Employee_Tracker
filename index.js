const inquirer = require('inquirer');
const Department = require('./lib/department.js');
const Role = require('./lib/role.js');
const Employee = require('./lib/employee.js');
require('dotenv').config();
const cTable = require('console.table');
const nameArray = [];
const deptArray=[];
var myRoleTitleArray =[];

// get the client

const mysql = require('mysql2');
const { async } = require('rxjs');
const { title } = require('process');
const { UnsubscriptionError } = require('rxjs');
const { write } = require('fs');

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
const getKeyByValue = async(obj, value) => {
   // value = "'" + value + "'";
   for (let i=0;i<obj.length;i++) {
    console.log(obj[i].manager_name + ',' + obj[i].manager_id);
    console.log(value);
    if (obj[i].manager_name == value){
        console.log ("match found");
        return obj[i].manager_id;
    }
   } 
   /*
   obj.forEach(element => {
        console.log(element.manager_name + ',' + element.manager_id);
        console.log(value);
        if (element.manager_name == value){
            console.log ("match found");
            return element.manager_id;
        }
        */
    }
        
  

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
                "Add Department",
                "EXIT"
            ]
        }
    ]);
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


const promptAddRole = async(nameArray) =>{ 
    
   
    const newRole =  await inquirer.prompt([
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
        type: 'confirm',
message: 'Does this role has any direct reportees : ',
name: 'directReportee',
//choices: ["true","false"],
    },
      {
        type: 'list',
message: 'Select the department where this employee belongs',
name: 'request',
choices: nameArray
    }
    
]);
console.log("my input is ::::: "+newRole.name);
return newRole; 
}



const promptNewEmployee = async(deptArray) =>{ 
   
    const newEmployee =  await inquirer.prompt([
    {
        type: 'input',
        name: 'firstName',
        message: "Enter the first name that you want to add : ",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the last name : ",
      },
      {
        type: 'list',
message: 'Select the department this employee belongs to',
name: 'department',
choices: deptArray
    }
]);
console.log("my input is ::::: "+newEmployee.department);
return newEmployee; 
}

const promptEmployeeRoles = async(roleTitleArray) =>{ 
    const myTitleArray =  roleTitleArray.map((item) => {return item.title});
  
    console.log(myTitleArray);
    const employeeRole =  await inquirer.prompt([
    
       {
        type: 'list',
message: 'The following roles exist in the department that this employee belongs to, please assign a role to the employee:',
name: 'emprole',
choices: myTitleArray
    }
]); 
console.log("my input is ::::: "+employeeRole.emprole);
return employeeRole;

}

const promptEmployeeManager = async(mgrArray) =>{ 
      
     
    //console.log(mgrArray); 

    const empMgrArr = mgrArray.map((item) => {return  item.manager_name + '-' + item.manager_id});
     //console.log(empMgrArr);
    const employeeMgr =  await inquirer.prompt([
    
       {
        type: 'list',
message: 'Please select the manager from the list below:',
name: 'empMgr',
choices:   empMgrArr
    }
]); 
console.log("my input is ::::: "+employeeMgr.empMgr);
return employeeMgr;

}


const getRolesByDept=async(deptName) =>{
    try{
    const [roleTitleRow,roleTitleFields] = await promisePool.query(
        `SELECT title FROM role,department where role.department_id = department.id AND department.name = "${deptName}" `); 
         return roleTitleRow;
    
          
    
    }catch(err){
        console.error(err);
    }
}

const getManagerDetails = async(deptName) => {
    try{
        const [rmanagerRow,managerFields] = await promisePool.query(
            //`SELECT title FROM role,department where role.department_id = department.id AND department.name = "${deptName}" `); 
            `SELECT  CONCAT(e.first_name, " ",e.last_name) manager_name, e.id as manager_id  FROM employee e 
            JOIN department d ON e.department_id = d.id AND d.name = "${deptName}" 
            LEFT JOIN role r ON e.role_id=r.id and r.direct_reportee = true
            union 
            select  "NONE" as manager_name,0 as manager_id from employee`);
             return rmanagerRow;
        
              
        
        }catch(err){
            console.error(err);
        }
}




const userSelection = async(userRequest) =>{
    switch(userRequest){
        case "View All Employees" : 
        {
            try{
                console.log("It says view Employee Names" + userRequest);
                await main();
                const employee = await new Employee();
                await employee.viewAllEmployees(promisePool);
                console.log("bla role");
                await init();
                break;
            }
            catch(err){
                console.error(err);
            }
        }


        case "Add Employee" : 
        {
             try{
                console.log("It says add a new Employee" + userRequest);
                await main();
                const [deptRow,deptFields] = await promisePool.query(
                `SELECT distinct name FROM department d where exists (select 1 from role r where r.department_id = d.id )`); 
                 
                 //console.log(deptRow[0].id,deptRow[0].name);
                const newEmployee = await promptNewEmployee(deptRow);
                console.log(newEmployee.department);


                // get all the roles belonging to a department
                const roleTitleRow = await getRolesByDept(newEmployee.department);

                // selected role by the user
                const rolesForDept = await promptEmployeeRoles(roleTitleRow); 
                console.log("******* "+rolesForDept.emprole);

                 // get the employee list from department who have direct_reportee set to true based on their roles
                const managerRow = await getManagerDetails(newEmployee.department);
                console.log(managerRow);
                // select manager by the user
                const manager = await promptEmployeeManager(managerRow);
                console.log(manager.empMgr);

              //  const managerID = await getKeyByValue(managerRow,manager.empMgr);  
               // console.log("manager id is " + managerID);

               // console.log(manager_id);

                // add the new employee record
                const emp =   new Employee(newEmployee.firstName,newEmployee.lastName,rolesForDept.emprole,newEmployee.department,manager.empMgr);
                await emp.addEmployee(promisePool);
                console.log("Employee record added successfully");
                await init();
                break;
            }catch(err)
            {
                console.error("Error adding employee record:" + err);
            } 
           // break;
        }

        case "Update Employee Role" : 
            console.log("It says Update Employee Role" + userRequest);
            await init();
            break;

        case "View All Roles" : 
        {
            try{
                console.log("It says view Employee Roles" + userRequest);
                await main();
                const role = await new Role();
                await role.viewAllRoles(promisePool);
                    
                console.log("bla role");
                await init();
                break;
            }
            catch(err){
                console.error(err);
            }
        }

        case "Add Role" : 
        {
            try{
                console.log("It says add Employee Role" + userRequest);
                await main();
                const [rows,fields] = await promisePool.query(
                `SELECT name FROM department`); 
                console.log(rows);
                const newRole = await promptAddRole(rows);
                const role = await new Role(newRole.title,newRole.salary,newRole.request,newRole.directReportee);
                await role.addRole(promisePool);
                console.log("bla 2");
                await init();
                break;
            }catch(err)
            {
                console.error(err);
            }
           // break;
        }
        case "View All Departments" : 
        {
            try{
                console.log("It says View All Departments" + userRequest);
                await main();
                const department = await new Department();
                await department.viewDepartments(promisePool);
                console.log("bla bls");
                await init();
                break;
            }
            catch(err){
                console.error(err);
            }
        }   

        case "Add Department" : 
        {
            console.log("It says Add Department" + userRequest);
            try{
                await main();
                const newDepartmentName = await promptAddDepartment();
                const department = await new Department(newDepartmentName);
                await department.AddDepartment(promisePool);
                console.log("bla 2");
                await init();
                break;
            }
            catch(err)
            {
                console.error(err);
            }
        }
        case "EXIT": {
            console.log("Exiting from application");
            process.exit();
            break;
        }
        
        default : console.log("The request didn't match with any of the choices"); 
    }
}


const newCheck = (userAnswer) => { if(newAnswer=="EXIT"){
    console.log("The user answer is : "+ userAnswer);
    console.log("Please exit");
}
else{
    console.log("The user answer is : "+ userAnswer);
    console.log("I am inside else");
    
}}
   


const processUserRequest = async(userRequest) => {
    try{
    await userSelection(userRequest);

   // const userAnswer = await promptUser();

   // await newCheck(userAnswer);
   /*  .then(()=>promptUser())
   .then((userAnswer)=>newCheck(userAnswer))
   .catch((error)=>{console.log(error)});  */
    }catch(err){
    console.log(err);
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