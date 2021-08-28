SELECT r.id,r.title,r.salary,d.name department FROM role r
JOIN department d
ON r.department_id = d.id;

