const Department = require("./department");

class Role {
    constructor(title,salary,department_name){
        //super(department_name);
        this.title = title;
        this.salary = salary;
        this.department_name = department_name;
    }

    viewAllRoles=async(promisePool)=>{
        //console.log("Name : "+ this.title);
        console.log("I am inside viewAllRoles now");
        const [rows,fields] = await promisePool.query(
            //`SELECT * FROM role`
             `SELECT role.id,role.title,role.salary,d.name department FROM role 
            JOIN department d
            ON role.department_id = d.id` 
            ); 
            console.log(rows);
            console.table(rows);
       
    }
    

    addRole=async(promisePool)=>{
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
    }

    updateEmployeeRole(){

    }
}

module.exports = Role;