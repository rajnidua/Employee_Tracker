class Department {
    constructor (departmentId, departmentName){
        this.departmentName = departmentName;
        this.departmentId = departmentId;
    }

    viewDepartments(){
        console.log("Name : "+ this.departmentName);
        console.log("I am inside viewDepartments now");
    }
}

module.exports = Department;