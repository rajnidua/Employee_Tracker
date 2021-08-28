//const Department = require("./department");

const { Console } = require("console");

class Employee {
    constructor(first_name,last_name,role_name,department_name,manager_name){
       
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_name = role_name;
        this.department_name = department_name;
        this.manager_name = manager_name;
        if (manager_name != null) {
        this.manager_name = manager_name.substring(0,manager_name.search('-'));
        this.manager_id = manager_name.substring(manager_name.search('-')+1,manager_name.length);
        console.log("manager name is" + this.manager_name);
        console.log("sub manager id is " + this.manager_id);
        }
      
    }

    viewAllEmployees=async(promisePool)=>{
      
        console.log("I am inside viewAllRoles now");
        const [rows,fields] = await promisePool.query(
           
            `SELECT e.id,e.first_name,e.last_name,r.title role,d.name department, concat(m.first_name , " " ,  m.last_name) AS manager 
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
            console.log("I am inside add employee now");
            try{


                const [deptrows,deptfields] = await promisePool.query(
                   `SELECT id FROM department where name = "${this.department_name}"`);
                   const empDepartmentId = deptrows;
                  
                    console.log("department id is:" + empDepartmentId);
                   
                
                    const [rolerows,rolefields] = await promisePool.query(
                        `SELECT id FROM role where title = "${this.role_name}"`);
                        const empRoleId = rolerows;
                       
                         console.log("role id is :" + empRoleId);
                           console.log("manager name is " + this.manager_name);
                           console.log("department id name is " + empDepartmentId[0].id );
                           console.log("role id  is " + empRoleId[0].id);

                        if (this.manager_name != "NONE") {
                             

                 const [empNewRow,fields1] = await promisePool.query(
                   `INSERT INTO employee (first_name, last_name, role_id, department_id,manager_id) 
                   values("${this.first_name}","${this.last_name}",${empRoleId[0].id},${empDepartmentId[0].id},${this.manager_id})`);
                       //title,salary,department_id) values ("${this.title}","${this.salary}","${empDepartmentId[0].id}") `); 
                    //  `INSERT INTO ROLE(TITLE, SALARY, DEPARTMENT_ID) SELECT "${this.title}","${this.salary}", department_id from department where department_NAME = "$(this.department_name)"`);
                    console.table(empNewRow);
                    //console.log("A new employee, "+ this.title +" has been added to the system."); 
                 }
               else {
                const [empNewRow,fields1] = await promisePool.query(
                    `INSERT INTO employee (first_name, last_name, role_id, department_id,manager_id) 
                    values("${this.first_name}","${this.last_name}",${empRoleId[0].id},${empDepartmentId[0].id},null)`);
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

   /*  updateEmployeeRole(){

    } */
}

module.exports = Employee;