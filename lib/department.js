class Department {
    constructor (newDepartmentName){
        this.newDepartmentName=newDepartmentName;
    }

      viewDepartments=async(promisePool)=>{
        
        //console.log("I am inside viewDepartments now");
       
            const [rows,fields] = await promisePool.query(
                `SELECT id,name FROM department
                order by id`); 
                //console.log(rows);
                console.table(rows);
    }

     AddDepartment=async(promisePool)=>{
        //console.log("I am inside AddDepartments now");
        try{
            const [rows,fields] = await promisePool.query(
                `INSERT INTO department(name) values (upper("${this.newDepartmentName}"))`); 

                //  console.table(rows);
                console.log("Added "+ this.newDepartmentName +"to the database");
        
           
       }
   
       catch(err){
           console.log(err);
       }
       
    } 



    deleteDeptRec= async(promisePool,delDeptId)=>{
        const [delDeptRec,deptFields] = await promisePool.query(
            `Delete From department               
              WHERE id = ${delDeptId}`);
              console.log("Department Record for Department ID "+ delDeptId + " has been deleted from the database"); 
    } 


    getDepartmentList=async(promisePool)=>{
        //console.log("I am inside AddDepartments now");
        try{
            const [deptList,fields] = await promisePool.query(
                `SELECT name as departmentName , id as departmentId from department`); 
          
            
                return deptList;
        
           
       }
   
       catch(err){
           console.log(err);
       }
       
    } 

    getEmpByDeptId = async(promisePool,deptID) => {
        try{
            const [deptEmpRecs,deptEmpFields] = await promisePool.query(
                `SELECT  CONCAT(e.first_name, " ",e.last_name) empName, e.id as empID, d.Name as deptName, r.Title, CONCAT(m.first_name, " ",m.last_name) mgrName 
                FROM employee e 
                Left JOIN department d ON e.department_id = d.id  
                LEFT JOIN role r ON e.role_id=r.id  
                Left Outer Join employee m on e.manager_id = m.id 
                where e.department_id = ${deptID}
                 `);
            return deptEmpRecs;
        }catch(err){
                console.error(err);
            }
    }


    getTotalBudgetByDeptId = async(promisePool,deptID) => {
        try{
            const [deptBudgetRecs,deptEmpFields] = await promisePool.query(
                `SELECT department.name AS Department_Name, 
                SUM(role.salary) AS Total_Utilized_Budget
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department on role.department_id = department.id
                WHERE role.department_id = ${deptID}
                Group By department.name
                 `);
            return deptBudgetRecs;
        }catch(err){
                console.error(err);
            }
    }

   
}

module.exports = Department;