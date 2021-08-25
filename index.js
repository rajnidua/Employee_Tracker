const inquirer = require('inquirer');

const promptUser = async() => {
    const userRequest = inquirer.prompt([
        {
            type: 'list',
    message: 'What would you like to do',
    name: 'request',
    choices: ["View All Employees",
              "Add Employee",
              "Update Employee Role",
               "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department"
            ]
        }
    ]) 
    return userRequest.request;
}


const processUserRequest = async(userRequest) => {
    switch(userRequest){
        case "View All Employees" : 
        console.log("It says View All Employee" + userRequest);
        break;

        case "Add Employee" : 
        console.log("It says Add Employee" + userRequest);
        break;

        case "Update Employee Role" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "View All Roles" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "Add Role" : 
        console.log("It says Update Employee Role" + userRequest);
        break;

        case "View All Departments" : 
        console.log("It says View All Departments" + userRequest);
        break;

        case "Add Department" : 
        console.log("It says Add Department" + userRequest);
        break;

        default : console.log("The request didn't match with any of the choices"); 

    }
}




const init = async() => {
    promptUser()
    .then((userRequest) =>{
        console.log("fvdf"+userRequest);
        processUserRequest(userRequest);
    })
    .catch((error)=>{console.log(error)});
}

init();