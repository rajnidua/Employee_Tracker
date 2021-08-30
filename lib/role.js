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

    chkExistRoleDept= async(promisePool,depID)=>{
     
        const [roleExists,roleFields] = await promisePool.query(
           `SELECT  count(*) as roleDeptRecCount     
             FROM role
             where department_id = ${depID}`); 
         return roleExists;
       }
 

     getRolesByDept=async(promisePool,deptID) =>{
        try{
            const [roleTitleRow,roleTitleFields] = await promisePool.query(
                `SELECT role.title as roleTitle, role.id as roleID FROM role where role.department_id =  ${deptID} `); 
               // console.table(roleTitleRow);
                return roleTitleRow;
        }catch(err){
            console.error(err);
        }
    }


    deleteRoleRec= async(promisePool,delroleId)=>{
        const [delRoleRec,roleFields] = await promisePool.query(
            `Delete From role               
              WHERE id = ${delroleId}`);
              console.log("Role Record for Role ID "+ delroleId + " has been deleted from the database"); 
    } 


    getRoles=async(promisePool,deptID) =>{
        try{
            const [roleRecs,roleRecFields] = await promisePool.query(
                `SELECT role.title as roleTitle, role.id as roleID FROM role `); 
               // console.table(roleTitleRow);
                return roleRecs;
        }catch(err){
            console.error(err);
        }
    }


}

module.exports = Role;