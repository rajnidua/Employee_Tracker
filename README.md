# Employee_Tracker
A command-line application to manage a company's employee database. This application uses Node.js, Inquirer, and MySQL.


  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

 
  ## Table of contents
  - [Description](#Description)
  - [Video](#Video)
  - [Screenshots](#Screenshot)
  - [Installation](#Installation)
  - [Usage](#Usage)
  - [Testing](#Testing)
  - [Contributing](#Contributing)
  - [Questions](#Questions)
  - [License](#License)

  ## Description
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role,View Employees By Manager,View Employees By Department,Total Utilized Budget For Department,EXIT
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
WHEN I choose View Employees By Manager
THEN I am prompted to choose a Manager from the list and I am presented with all the employees who directly report to that manager.
WHEN I choose View Employees By Department
Then I am prompted to choose from the list of departments and I am presented with the employee records in that department.
WHEN I choose Total Utilized Budget For Department,
Then I am prompted to choose from the list of department and I am presented with the total utilized budget for that department.
```

## Video



## Screenshot

[![screenshot1]()]

[![screenshot2]()]


## Installation
  ```md
    node js
  npm install
  npm install Mysql2
  npm install dotenv
  npm install console.table --save
  npm install inquirer
  ```

  ## Usage
  create .env file and write the username,password and host details for your mysql2 connection.
  run all the installations.
  Go to mysql shell in your terminal, establish connection using "mysql -u root -p" command , provide the password.
  Go into db folder using 'cd db'. Create the database named 'ets' ,then 'use ets' and then 'SOURCE schema.sql'.
  Create data using 'SOURCE seeds.sql'
  Come out of sql, go to the root folder and type 'node index'

  
  ## Testing
  Use the different options in the prompts and check the result data. 

  ## Contributing
  Rajni Dua

  ## Questions
  For any further questions, reachout to me at :
  - Github: [rajnidua](https://github.com/rajnidua)
  - Email: rajni.dua14@gmail.com

## License
    
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
  
&copy;  2021  Rajni Dua
    
*Licensed under [MIT](./license)*
