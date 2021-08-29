const Department = require("./department");

class Role {
    constructor(title,salary,department_id,direct_reportee){
        //super(department_name);
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
        this.direct_reportee = direct_reportee;
    }

    viewAllRoles=async(promisePool)=>{
        //console.log("Name : "+ this.title);
        //console.log("I am inside viewAllRoles now");
        const [rows,fields] = await promisePool.query(
            //`SELECT * FROM role`
             `SELECT role.id,role.title,d.name department,role.salary,IF(direct_reportee,'true','false') as "Direct Reports" FROM role 
            JOIN department d
            ON role.department_id = d.id
            ORDER BY ROLE.ID` 
            ); 
          //  console.log(rows);
            console.table(rows);
       
    }
    

    addRole=async(promisePool)=>{
        {
            //console.log("I am inside add Role now");
            try{
                    const [newRoleRec,fields1] = await promisePool.query(
                   `INSERT INTO role(title,salary,department_id,direct_reportee) values ("${this.title}",${this.salary},${this.department_id},${this.direct_reportee}) `); 
                    
                    console.log("Added"+ this.title +" to the database"); 
             
               
           }
       
           catch(err){
               console.error(err);
           }
           
        } 
    }

    updateEmployeeRole(){

    }

     getRolesByDept=async(promisePool,deptID) =>{
        try{
            const [roleTitleRow,roleTitleFields] = await promisePool.query(
                `SELECT role.title as roleTitle, role.id as roleID FROM role where role.department_id =  ${deptID} `); 
                console.table(roleTitleRow);
                return roleTitleRow;
        }catch(err){
            console.error(err);
        }
    }
}

module.exports = Role;