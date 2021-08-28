/*
INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance");


    INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead","100000","2"),
       ("Lead Engineer","80000","1");

SELECT * FROM department;
SELECT * FROM role;



INSERT INTO employee (first_name,last_name,role_id,department_id,manager_id)
VALUES ("Rajni","Dua","2","2","1"),
("Lina","flynn","2","1",NULL);
*/
SELECT e.id,e.first_name,e.last_name,r.title role,d.name department, concat(m.first_name , " " ,  m.last_name) AS manager 
            FROM employee e
            LEFT OUTER JOIN
             employee m 
             ON e.manager_id = m.id
            JOIN
              role r
              ON e.role_id = r.id
              JOIN
               department d
            ON
             e.department_id = d.id;
            /*
             join employee m
             e.manager_id = m.id; */