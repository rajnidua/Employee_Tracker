INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance");


    INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead","100000","2"),
       ("Lead Engineer","80000","1");

SELECT * FROM department;
SELECT * FROM role;

SELECT id FROM department where name = "Engineering";