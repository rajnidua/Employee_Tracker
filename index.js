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
              "Delete Employee",
              "Update Employee Role",
               "View All Roles",
                "Add Role",
                "Delete Role",
                "View All Departments",
                "Add Department",
                "Delete Department",
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
                


                // get all the roles belonging to a department
                const role = new Role();
                const roleTitleRow = await role.getRolesByDept(promisePool,newEmployee.department);
             
                
                // selected role by the user
                const selectionEmpRoles = new selection;
                const rolesForDept = await selectionEmpRoles.promptEmployeeRoles(roleTitleRow); 
                
             

                 // get the employee list from department who have direct_reportee set to true based on their roles
                const empGetManager = new Employee();
                 const managerRow = await empGetManager.getManagerDetails(promisePool,newEmployee.department);
              
                // select manager by the user
                const manager = await selectionEmpRoles.promptMgrList(managerRow);

                // add the new employee record
                const emp =   new Employee(newEmployee.firstName,newEmployee.lastName,rolesForDept,newEmployee.department,manager);
                await emp.addEmployee(promisePool);
                 
                await init();
                break;
            }catch(err)
            {
                console.error("Error adding employee record:" + err);
            } 
           // break;
        }

        

        case "Delete Employee" : 
        {
            try{
             
               await main();
                const [empRows,empFields] = await promisePool.query(
                 `SELECT CONCAT (first_name ," ",last_name) as EmployeeName, id as EmployeeID FROM employee`); 
                //`SELECT first_name ,last_name,id FROM employee`);
                
                 if (empRows.length == 0){console.log (
                     "No Employee Records exist"); 
                     return;}
            
                  // Prompt employee selection from user  (empSel) 
                  const selectionEmp = new selection;
                 const selEmployee = await selectionEmp.promptEmployeeList(empRows);
                 
                 // Check if employee exists as a manager
                 const empBySel = new Employee;
                      const mgrExist =   await empBySel.chkExistMgr(promisePool,selEmployee.empSel);
                      console.log(mgrExist);
                      if(mgrExist[0].recCount > 0) {
                       console.log("Employee Record can not be deleted as it exists as a Manager");
                       
                      } else {
                          // delete employee record
                           
                       await empBySel.deleteEmployeeRec(promisePool,selEmployee.empSel);   
                      } 
              
               await init();
               break;
           }catch(err)
           {
               console.error("Error deleting the employee record:" + err);
           } 
          // break;
       }

        case "Update Employee Role" : 
        {
            try{
             
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
   
                 const empDetails = Object.values(empDet);
           
               // get all the roles  
               const roleLst = new Role;
               const roleRecords = await roleLst.getRoles(promisePool);

               // selected updated role by the user
               const selectionEmployeeRoles = new selection;
               const rolesForDept = await selectionEmployeeRoles.promptEmployeeRoles(roleRecords); 
            
               // add the new employee record
               const emp =   new Employee(empDetails[0].firstName,empDetails[0].lastName,rolesForDept,empDetails[0].curEmpDept,empDetails[0].curEmpMgrID);
               await emp.updateEmployeeRole(promisePool,employeeList.empSel,rolesForDept);
              
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
                 
                await main();
                const role = await new Role();
                await role.viewAllRoles(promisePool);    
                
                await init();
                break;
            }
            catch(err){
                console.error(err);
            }
        }


        case "Delete Role" : 
        {
            try{
               
                await main();
                const roleList = await new Role();
                const roleData = await roleList.getRoles(promisePool);    

                // selected  role by the user for deletion
               const selectionRole = new selection;
               const rolesForDept = await selectionRole.promptEmployeeRoles(roleData); 
               
               // check if any records exists
               const empRole = new Employee;
               const empRecExist =   await empRole.chkExistEmp(promisePool,rolesForDept);
               console.log(empRecExist);
               if(empRecExist[0].empRecCount > 0) {
                console.log("Role Record can not be deleted as there are " + empRecExist[0].empRecCount + " employee record exists for this role" );
                
               } else {
                   // delete role record
                    
                await roleList.deleteRoleRec(promisePool,rolesForDept);   
               } 
       

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
                
                await main();

                const deptNew = new Department;
                const deptRecs = await deptNew.getDepartmentList(promisePool);
                
                 
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
             
                await main();
                const department = await new Department();
                await department.viewDepartments(promisePool);
                 
                await init();
                break;
            }
            catch(err){
                console.error(err);
            }
        }   

        case "Add Department" : 
        {
             
            try{
                await main();
                const selectionAddDept = new selection;
                const newDepartmentName = await selectionAddDept.promptAddDepartment();
                const department = await new Department(newDepartmentName);
                await department.AddDepartment(promisePool);
                
                await init();
                break;
            }
            catch(err)
            {
                console.error(err);
            }
        }



        case "Delete Department" : 
        {
            try{
               
                await main();
                const delDepartment = await new Department();
                const deptData = await delDepartment.getDepartmentList(promisePool);    

                // selected  role by the user for deletion
               const selectDelDept = new selection;
               const deptSelDel = await selectDelDept.promptDeptList(deptData); 
               
               // check if any records exists
               const empDept = new Employee;
               const empDeptRecExist =   await empDept.chkExistEmpDept(promisePool,deptSelDel);

               const roleDept = new Role;
               const roleDeptRecExist =   await roleDept.chkExistRoleDept(promisePool,deptSelDel);
                
               if((empDeptRecExist[0].empDeptRecCount > 0) || (roleDeptRecExist[0].roleDeptRecCount > 0)) {
                console.log("Department Record can not be deleted as  employee or role record exists for this Department" );
                
               } else {
                   // delete role record
                    
                await delDepartment.deleteDeptRec(promisePool,deptSelDel);   
               } 
       

                await init();
                break;
            }
            catch(err){
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
        
        const selectionDeptList = new selection;
       const usrDeptSel = await selectionDeptList.promptDeptList(usrDeptList);
          
    
       const empByDeptRecs = await empDeptList.getEmpByDeptId(promisePool,usrDeptSel);
       if (empByDeptRecs.length != 0) {
       console.table(empByDeptRecs);
       } else {console.log("No employee records found for the selected department");}
 
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
   
      // Get Department List
       const empDeptList = await new Department();
       const usrDeptList = await empDeptList.getDepartmentList(promisePool);
  
        // Prompt User to select a department 
        const selectionDeptList = new selection;
       const usrDeptSel = await selectionDeptList.promptDeptList(usrDeptList);
     
    
       const totalBudgetByDeptRecs = await empDeptList.getTotalBudgetByDeptId(promisePool,usrDeptSel);
       if (totalBudgetByDeptRecs.length != 0) {
       console.table(totalBudgetByDeptRecs);
       } else {console.log("No Budget found for the selected department");}

 
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
    
     promptUser()
      .then((userRequest) =>
         processUserRequest(userRequest)
      ) 
      .catch((error)=>{console.log(error)}); 
  }
  


init();
