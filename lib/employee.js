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
                       //title,salary,department_id) values ("${this.title}","${this.salary}","${empDepartmentId[0].id}") `); 
                    //  `INSERT INTO ROLE(TITLE, SALARY, DEPARTMENT_ID) SELECT "${this.title}","${this.salary}", department_id from department where department_NAME = "$(this.department_name)"`);
                    console.table(empNewRow);
                    //console.log("A new employee, "+ this.title +" has been added to the system."); 
                 }
               else {
                const [empNewRow,fields1] = await promisePool.query(
                    `INSERT INTO employee (first_name, last_name, role_id, department_id,manager_id) 
                    values("${this.first_name}","${this.last_name}",${this.role_id},${this.department_id},null)`);
                        //title,salary,department_id) values ("${this.title}","${this.salary}","${empDepartmentId[0].id}") `); 
                     //  `INSERT INTO ROLE(TITLE, SALARY, DEPARTMENT_ID) SELECT "${this.title}","${this.salary}", department_id from department where department_NAME = "$(this.department_name)"`);
                     console.table(empNewRow);
                    
               }
           }
       
           catch(err){
               console.log(err);
           }
           
        } 
    } 

    updateEmployeeRole= async(promisePool,updEmpId)=>{
        const [empUpdRow,fields1] = await promisePool.query(
            `Update Employee
              SET role_id = ${this.role_id}
              WHERE id = ${updEmpId}`);
                //title,salary,department_id) values ("${this.title}","${this.salary}","${empDepartmentId[0].id}") `); 
             //  `INSERT INTO ROLE(TITLE, SALARY, DEPARTMENT_ID) SELECT "${this.title}","${this.salary}", department_id from department where department_NAME = "$(this.department_name)"`);
             console.table(empUpdRow);
    } 


    getManagerDetails = async(promisePool,deptName) => {
        try{
            const [rmanagerRow,managerFields] = await promisePool.query(
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



    
    getEmpById= async(promisePool,empID)=>{
     
        const [empSelData,empFields] = await promisePool.query(
           `SELECT first_name as firstName, last_name as lastName, id as employeeID, department_id  as curEmpDept, role_id as curEmpRoleId, manager_id as curEmpMgrID    
             FROM employee
             where id = ${empID}`); 
             //console.table(empSelData);
         //console.log("The whole employee record is :" +empSelData);
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