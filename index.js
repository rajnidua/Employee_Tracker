const inquirer = require('inquirer');
const Department = require('./lib/department.js');
const Role = require('./lib/role.js');
const Employee = require('./lib/employee.js');
const util = require('util');
const selection = require("./utils/selection.js");
require('dotenv').config();
const cTable = require('console.table');
var figlet = require('figlet');

// get the client

const mysql = require('mysql2');
const { async, throwError } = require('rxjs');
const { title } = require('process');
const { UnsubscriptionError } = require('rxjs');
const { write } = require('fs');
const { clear, exception } = require('console');

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

const getKeyByValue = async(obj, value) => {
   for (let i=0;i<obj.length;i++) {
        //console.log(obj[i].manager_name + ',' + obj[i].manager_id);
        //console.log(value);
        if (obj[i].manager_name == value){
            //console.log ("match found");
            return obj[i].manager_id;
        }
    } 
}
//prompt for the main menu        
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
                "View Employees By Manager",
                "View Employees By Department",
                "Total Utilized Budget For Department",
                "EXIT"
            ]
        }
    ]);
    return userRequest.request;
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
                //console.log("It says add a new Employee" + userRequest);
                await main();
                const [deptRow,deptFields] = await promisePool.query(
                `SELECT distinct name as deptName,id as deptID FROM department d where exists (select 1 from role r where r.department_id = d.id )`); 
                 
                 //console.log(deptRow[0].id,deptRow[0].name);
                //const newEmployee = await promptNewEmployee(deptRow);
                const Selection = new selection;
                
                const newEmployee = await Selection.promptNewEmployee(deptRow);
                console.log("The value in new employee.department is :"+newEmployee.department);


                // get all the roles belonging to a department
                const role = new Role();
                const roleTitleRow = await role.getRolesByDept(promisePool,newEmployee.department);
                //const roleTitleRow = await getRolesByDept(newEmployee.department);
                console.table(roleTitleRow);
                    console.log("The value of role title row is :"+roleTitleRow);
                // selected role by the user
                const selectionEmpRoles = new selection;
                const rolesForDept = await selectionEmpRoles.promptEmployeeRoles(roleTitleRow); 
                
                console.log("******* "+rolesForDept);

                 // get the employee list from department who have direct_reportee set to true based on their roles
                const empGetManager = new Employee();
                 const managerRow = await empGetManager.getManagerDetails(promisePool,newEmployee.department);
                console.log(managerRow);
                // select manager by the user
                const manager = await promptEmployeeManager(managerRow);
                console.log(manager.empMgr);


                // add the new employee record
                const emp =   new Employee(newEmployee.firstName,newEmployee.lastName,rolesForDept,newEmployee.department,manager.empMgr);
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
        {
            try{
               console.log("It says update an employee Role " + userRequest);
               await main();
                const [empRow,empFields] = await promisePool.query(
                 `SELECT CONCAT (first_name ," ",last_name) as EmployeeName, id as EmployeeID FROM employee`); 
                //`SELECT first_name ,last_name,id FROM employee`);
                
                 if (empRow.length == 0){console.log (
                     "No Employee Records exist"); 
                     return;}
            
                  // Prompt employee selection from user  (empSel) 
                  const selectionEmpList = new selection;
                 const employeeList = await selectionEmpList.promptEmployeeList(empRow);
                console.log("The employee name you want to change role is : "+employeeList);
                 
                // get employee detail by employee id selected by user
                const empById = new Employee;
                const empDet = await empById.getEmpById(promisePool,employeeList.empSel);
                console.log("Employee details are" + empDet);
                console.table(empDet);  
                 const empDetails = Object.values(empDet);
                console.log("curEmpDept" + empDetails[0].curEmpDept);
               // get all the roles belonging to the selected employee department
               const roleByDepartment = new Role;
               const roleRecs = await roleByDepartment.getRolesByDept(empDetails[0].curEmpDept);

               // selected updated role by the user
               const selectionEmployeeRoles = new selection;
               const rolesForDept = await selectionEmployeeRoles.promptEmployeeRoles(roleRecs); 
               console.log("******* "+rolesForDept);
 
            

               // add the new employee record
               const emp =   new Employee(empDetails[0].firstName,empDetails[0].lastName,rolesForDept,empDetails[0].curEmpDept,empDetails[0].curEmpMgrID);
               await emp.updateEmployeeRole(promisePool,employeeList.empSel);
               console.log("Employee record updated successfully");
               await init();
               break;
           }catch(err)
           {
               console.error("Error adding employee record:" + err);
           } 
          // break;
       }


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
                const [deptRecs,fields] = await promisePool.query(
                `SELECT name as deptName, id as deptID FROM department`); 
                 console.log(deptRecs);
                 const selectionAddRole = new selection; 
                const newRole = await selectionAddRole.promptAddRole(deptRecs);
                const role = await new Role(newRole.title,newRole.salary,newRole.dept,newRole.directReportee);
                await role.addRole(promisePool);
                
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
                const selectionAddDept = new selection;
                const newDepartmentName = await selectionAddDept.promptAddDepartment();
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

        case "View Employees By Manager" : 
        {
        try{
            await main();
           const empMgrList = await new Employee();
           const usrMgrList = await empMgrList.getManagersList(promisePool);
           const selectionMgrList = new selection;
           const usrMgrSel = await selectionMgrList.promptMgrList(usrMgrList);
           
         
           const empByMgrRecs = await empMgrList.getEmpByMgrId(promisePool,usrMgrSel);
           console.log("Selected manager's Id is: " + usrMgrSel); 
           console.log("The employees who report to this manager are : ")

           if (empByMgrRecs.length != 0) {
                console.table(empByMgrRecs);
           } else {
               console.log("No Employee reports to selected manager");
           }
           
           await init();
                break;
        }catch(err){
            console.error(err);
        }
    }

    case "View Employees By Department" : 
    {
    try{
        await main();
       const empDeptList = await new Department();
       const usrDeptList = await empDeptList.getDepartmentList(promisePool);
       console.table(usrDeptList);
        const selectionDeptList = new selection;
       const usrDeptSel = await selectionDeptList.promptDeptList(usrDeptList);
       console.log("Selected department's Id is: " + usrDeptSel);  
    
       const empByDeptRecs = await empDeptList.getEmpByDeptId(promisePool,usrDeptSel);
       if (empByDeptRecs.length != 0) {
       console.table(empByDeptRecs);
       } else {console.log("No employee records found for the selected department");}

      /* const empByMgrRecs = await empMgrList.getEmpByMgrId(promisePool,usrMgrSel);
       console.log("Selected manager's Id is: " + usrMgrSel); 
       console.log("The employees who report to this manager are : ")
      console.table(empByMgrRecs); */

       
       await init();
            break;
    }catch(err){
        console.error(err);
    }
}


case "Total Utilized Budget For Department" : 
    {
    try{
        await main();
       const empDeptList = await new Department();
       const usrDeptList = await empDeptList.getDepartmentList(promisePool);
       console.table(usrDeptList);
        const selectionDeptList = new selection;
       const usrDeptSel = await selectionDeptList.promptDeptList(usrDeptList);
       console.log("Selected department's Id is: " + usrDeptSel);  
    
       const totalBudgetByDeptRecs = await empDeptList.getTotalBudgetByDeptId(promisePool,usrDeptSel);
       if (totalBudgetByDeptRecs.length != 0) {
       console.table(totalBudgetByDeptRecs);
       } else {console.log("No Budget found for the selected department");}

      /* const empByMgrRecs = await empMgrList.getEmpByMgrId(promisePool,usrMgrSel);
       console.log("Selected manager's Id is: " + usrMgrSel); 
       console.log("The employees who report to this manager are : ")
      console.table(empByMgrRecs); */

       
       await init();
            break;
    }catch(err){
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


const processUserRequest = async(userRequest) => {
    try{
    await userSelection(userRequest);
    }catch(err){
    console.log(err);
}
}


/* const show = async() => new Promise((resolve, reject) => {
    figlet('Employee Tracking System', (err, data) => {
     if (err) {
      return reject(err);
     }
   
     return resolve(console.log(data));
    });
   }) */
/* const myFunction=async()=>{
    promptUser()
      .then((userRequest) =>
         processUserRequest(userRequest)
      ) 
      .catch((error)=>{console.log(error)});
} */


const init = async() => {
    //console.log("I am in INIT");
    /* const selectionShow = new selection;
    await selectionShow.show(); */
   // await myFunction();
    //.then((data)=>console.log(data))
     promptUser()
      .then((userRequest) =>
         processUserRequest(userRequest)
      ) 
      .catch((error)=>{console.log(error)}); 
  }
  

/* const init=async()=>{
const view = await figlet('Hello World!!', function(err, data) {
   
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
   

})
//promptInit();
//.then(()=>promptInit())
} */



init();
//.then(()=>promptInit());