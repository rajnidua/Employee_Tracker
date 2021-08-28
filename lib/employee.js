//const Department = require("./department");

class Employee {
    constructor(first_name,last_name,role_name,manager_name){
       
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_name = role_name;
        this.manager_name = manager_name;
    }

    viewAllEmployees=async(promisePool)=>{
      
        console.log("I am inside viewAllRoles now");
        const [rows,fields] = await promisePool.query(
           
            `SELECT e.id,e.first_name,e.last_name,r.title role,d.name department, concat(m.first_name , " " ,  m.last_name) AS manager 
            FROM employee e
            LEFT OUTER JOIN
             employee m 
             ON e.manager_id = m.id
            JOIN
              role r
              ON e.role_id = r.id
              JOIN
               department d
            ON
             e.department_id = d.id
            `
            ); 
            console.log(rows);
            console.table(rows);
       
    }
    

    /* addEmployee=async(promisePool)=>{
        {
            console.log("I am inside add Role now");
            try{
                const [rows,fields] = await promisePool.query(
                   `SELECT id FROM department where name = "${this.department_name}"`);
                   const myDepartmentId = rows;
                  
                    console.log(myDepartmentId);
                   
                    console.log("The value for department name is "+this.department_name+" The corresponding id is " + myDepartmentId[0].id +"fields is"+fields );
                 const [rows1,fields1] = await promisePool.query(
                   `INSERT INTO role(title,salary,department_id) values ("${this.title}","${this.salary}","${myDepartmentId[0].id}") `); 
                    //  `INSERT INTO ROLE(TITLE, SALARY, DEPARTMENT_ID) SELECT "${this.title}","${this.salary}", department_id from department where department_NAME = "$(this.department_name)"`);
                    console.table(rows1);
                    console.log("A new role, "+ this.title +" has been added to the system."); 
             
               
           }
       
           catch(err){
               console.log(err);
           }
           
        } 
    } */

   /*  updateEmployeeRole(){

    } */
}

module.exports = Employee;