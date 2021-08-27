class Department {
    constructor (newDepartmentName){
        this.newDepartmentName=newDepartmentName;
    }

    viewDepartments(connection){
        console.log("Name : "+ this.departmentName);
        console.log("I am inside viewDepartments now");
        connection.query(
            `SELECT * FROM department`,
              function(err, results) {
                console.table(results); // results contains rows returned by server
              }
            );
    }

     AddDepartment(connection){
        console.log("I am inside AddDepartments now");
        try{
           
           connection.promise().query
        (
            `INSERT INTO department(name) values ("${this.newDepartmentName}")`)
         
            .then((rows)=>{
                console.log("A new department, "+ this.newDepartmentName +" has been added to the system.");
            })
            .catch(console.log)
            .then(()=>connection.end());
           
       }
   
       catch(err){
           console.log(err);
       }
       
    } 

   
}

module.exports = Department;