//const Department = require("./department");

const { Console } = require("console");
const { async } = require("rxjs");

class Employee {
    constructor(first_name,last_name,role_id,department_id,manager_id){
       
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.department_id = department_id;
        this.manager_id = manager_id;
         
    }

    viewAllEmployees=async(promisePool)=>{
      
         
        const [rows,fields] = await promisePool.query(
           
            `SELECT e.id,e.first_name,e.last_name,r.title ,d.name department, r.salary, concat(m.first_name , " " ,  m.last_name) AS manager 
            FROM employee e
            LEFT JOIN
             employee m 
             ON e.manager_id = m.id and m.id is not null
            JOIN
              role r
              ON e.role_id = r.id
              JOIN
               department d
            ON
             e.department_id = d.id
             Order By e.id
            `
            ); 
       if(rows.length == 0) {
           console.log("No Employee Records exist");
        }
           // console.log(rows);
            console.table(rows);
       
    }
    

     addEmployee=async(promisePool)=>{
        {
         //   console.log("I am inside add employee now");
            try{


            
                        if (this.manager_id != 0) {
                             

                 const [empNewRow,fields1] = await promisePool.query(
                   `INSERT INTO employee (first_name, last_name, role_id, department_id,manager_id) 
                   values("${this.first_name}","${this.last_name}",${this.role_id},${this.department_id},${this.manager_id})`);
                   console.log("Added " + this.first_name + "" + this.last_name + " to the database" );
                 }
               else {
                const [empNewRow,fields1] = await promisePool.query(
                    `INSERT INTO employee (first_name, last_name, role_id, department_id,manager_id) 
                    values("${this.first_name}","${this.last_name}",${this.role_id},${this.department_id},null)`);
                    console.log("Added " + this.first_name + "" + this.last_name + " to the database" );
               }
           }
       
           catch(err){
               console.log(err);
           }
           
        } 
    } 

    updateEmployeeRole= async(promisePool,updEmpId,updRoleId)=>{
        const [empUpdRow,fields1] = await promisePool.query(
            `Update Employee
              SET role_id = ${updRoleId}
              , department_id = (select department_id from role where id = ${updRoleId})
              WHERE id = ${updEmpId}`);
              console.log("Employee " + this.first_name + " " + this.last_name + " role has been updated in the database"); 
    } 

    deleteEmployeeRec= async(promisePool,delEmpId)=>{
        const [delEmpRec,fields1] = await promisePool.query(
            `Delete From Employee               
              WHERE id = ${delEmpId}`);
              console.log("Employee Record for Employee ID "+ delEmpId + " has been deleted from the database"); 
    } 


    getManagerDetails = async(promisePool,deptName) => {
        try{
            /*
            const [rmanagerRow,managerFields] = await promisePool.query(
                `SELECT  CONCAT(e.first_name, " ",e.last_name) managerName, e.id as managerId  FROM employee e 
                JOIN department d ON e.department_id = d.id AND d.name = "${deptName}" 
                LEFT JOIN role r ON e.role_id=r.id and r.direct_reportee = true
                union 
                select  "NONE" as managerName,0 as managerId from employee`);
            */
                const [rmanagerRow,managerFields] = await promisePool.query(
                    `SELECT  CONCAT(e.first_name, " ",e.last_name) managerName, e.id as managerId  FROM employee e 
                    JOIN department d ON e.department_id = d.id   
                    JOIN role r ON e.role_id=r.id and r.direct_reportee = true
                    union 
                    select  "NONE" as managerName,0 as managerId from employee`);
    
                return rmanagerRow;
        }catch(err){
                console.error(err);
            }
    }


    getEmpByMgrId = async(promisePool,mgrID) => {
        try{
            const [mgrEmpRecs,mgrEmpFields] = await promisePool.query(
                `SELECT  CONCAT(e.first_name, " ",e.last_name) empName, e.id as empID, d.Name as deptName, r.Title  
                FROM employee e 
                Left JOIN department d ON e.department_id = d.id  
                LEFT JOIN role r ON e.role_id=r.id  
                where e.manager_id = ${mgrID}
                 `);
            return mgrEmpRecs;
        }catch(err){
                console.error(err);
            }
    }



    chkExistMgr= async(promisePool,empID)=>{
     
        const [mgrExist,empFields] = await promisePool.query(
           `SELECT  count(*) as recCount     
             FROM employee
             where manager_id = ${empID}`); 
         return mgrExist;
       }

       chkExistEmp= async(promisePool,roleID)=>{
     
        const [empExist,empFields] = await promisePool.query(
           `SELECT  count(*) as empRecCount     
             FROM employee
             where role_id = ${roleID}`); 
         return empExist;
       }


       chkExistEmpDept= async(promisePool,depID)=>{
     
        const [empExists,empFields] = await promisePool.query(
           `SELECT  count(*) as empDeptRecCount     
             FROM employee
             where department_id = ${depID}`); 
         return empExists;
       }

    
    getEmpById= async(promisePool,empID)=>{
     
        const [empSelData,empFields] = await promisePool.query(
           `SELECT first_name as firstName, last_name as lastName, id as employeeID, department_id  as curEmpDept, role_id as curEmpRoleId, manager_id as curEmpMgrID    
             FROM employee
             where id = ${empID}`); 
         return empSelData;
       }

       getManagersList = async(promisePool) => {
        try{
            const [mgrRecs,mgrFields] = await promisePool.query(
                `SELECT  CONCAT(e.first_name, " ",e.last_name) managerName, e.id as managerId  FROM employee e 
                JOIN employee m on e.id = m.manager_id and m.manager_id is not null;
               `);
            return mgrRecs;
        }catch(err){
                console.error(err);
            }
       }
       
}

module.exports = Employee;