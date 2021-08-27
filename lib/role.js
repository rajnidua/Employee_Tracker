const Department = require("./department");

class Role extends Department{
    constructor(title,salary,department_name){
        super(department_name);
        this.title = title;
        this.salary = salary;
    }

    viewAllRoles=async(promisePool)=>{
        console.log("Name : "+ this.title);
        console.log("I am inside viewAllRoles now");
        const [rows,fields] = await promisePool.query(
            `SELECT * FROM role`); 

            console.table(rows);
       
    }
    

    addRole=async(promisePool)=>{
        {
            console.log("I am inside add Role now");
            try{
                const [rows,fields] = await promisePool.query(
                    `INSERT INTO role(title,salary,department_id) values ("${this.title}","${this.salary}","2") `); 
    
                    console.table(rows);
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