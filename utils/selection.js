const inquirer = require('inquirer');
class selection{
//prompt for new employee
  promptNewEmployee = async(deptArray) =>{ 

    const deptList =  deptArray.map((item) => {
        return {
            name: item.deptName,
            value: item.deptID
        }       
    });
   
    const newEmployee =  await inquirer.prompt([
     {
        type: 'input',
        name: 'firstName',
        message: "Enter the first name that you want to add : ",
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the last name : ",
      },
      {
        type: 'list',
        message: 'Select the department this employee belongs to',
        name: 'department',
        choices: deptList
    }
]);
//console.log("my input is ::::: "+newEmployee.department);
return newEmployee; 
} 


 promptEmployeeRoles = async(roleTitleArray) =>{ 
    const roleList =  roleTitleArray.map((item) => {
       return {
           name: item.roleTitle,
           value: item.roleID
       }       
   });
//console.log(roleList);
   const employeeRole =  await inquirer.prompt([
       {
       type: 'list',
       message: 'The following roles exist in the department that this employee belongs to, please assign a role to the employee:',
       name: 'empRole',
       choices: roleList
   }
]); 
//console.log("The vlaue inside prompt is : "+employeeRole.empRole+" The whole value is "+employeeRole);
return employeeRole.empRole;
}


 promptEmployeeList= async(empList)=>{
    const myEmpArray =  empList.map((item) => {
    return {
            name: item.EmployeeName,
            value: item.EmployeeID
        }       
    });
  //console.log(myEmpArray);
    const empSelected =  await inquirer.prompt([
    {
        type: 'list',
        message: 'Please select the Employee record from the list below to update:',
        name: 'empSel',
        choices:   myEmpArray
     }
 ]); 
 //console.log("user selection is :" + empSelected.empSel);
 return empSelected;
}

 promptAddRole = async(deptArray) =>{
    //extracting department name and value
    const deptList =  deptArray.map((item) => {
        return {
            name: item.deptName,
            value: item.deptID
        }       
    });
   //prompt the user for adding role
    const newRole =  await inquirer.prompt([
     {
        type: 'input',
        name: 'title',
        message: "Enter the role title that you want to add : ",
      },
      {
        type: 'number',
        name: 'salary',
        message: "Enter the salary in that role : ",
      },
      {
        type: 'confirm',
message: 'Does this role has any direct reportees : ',
name: 'directReportee',

    },
    {
        type: 'list',
        message: 'Select the department where this employee belongs',
        name: 'dept',
        choices: deptList
    }
    
]);
//console.log("my input is ::::: "+newRole.name);
return newRole; 
}

 promptAddDepartment = async() =>{ 
    const newDepartmentName =  await inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "Enter the department name that you want to add : ",
      }
]);
//console.log("my input is ::::: "+newDepartmentName.name);
    return newDepartmentName.name;
}


}
module.exports=selection;