class Department {
    constructor (newDepartmentName){
        this.newDepartmentName=newDepartmentName;
    }

      viewDepartments=async(promisePool)=>{
        
        //console.log("I am inside viewDepartments now");
       
            const [rows,fields] = await promisePool.query(
                `SELECT name FROM department`); 
                //console.log(rows);
                console.table(rows);
    }

     AddDepartment=async(promisePool)=>{
        //console.log("I am inside AddDepartments now");
        try{
            const [rows,fields] = await promisePool.query(
                `INSERT INTO department(name) values ("${this.newDepartmentName}")`); 

                console.table(rows);
                console.log("A new department, "+ this.newDepartmentName +" has been added to the system.");
        
           
       }
   
       catch(err){
           console.log(err);
       }
       
    } 

   
}

module.exports = Department;