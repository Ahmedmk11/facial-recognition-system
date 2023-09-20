-- Initialization

CREATE DATABASE xceed;

USE xceed;

SHOW DATABASES;

-- Queries

CREATE PROCEDURE CreateAllTables()
BEGIN

    CREATE TABLE Department (
        id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        site VARCHAR(128) NOT NULL,
        dep_status VARCHAR(1) NOT NULL
    );

    CREATE TABLE User (
        id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
        firstname VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        jobtitle VARCHAR(128),
        street_address VARCHAR(95) NOT NULL,
        city VARCHAR(30) NOT NULL,
        country VARCHAR(74) NOT NULL,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        role VARCHAR(8),
        date_joined DATE,
        birthdate DATE NOT NULL,
        employment_status VARCHAR(32),
        department_id INT,
        embedding BLOB,
        FOREIGN KEY (department_id) REFERENCES Department(id)
    );

    CREATE TABLE Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        attendance_date DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(id)
    );
END;

CREATE PROCEDURE DropAllTables()
BEGIN
    DROP TABLE Department;
    DROP TABLE Attendance;
    DROP TABLE User;
END;

CREATE PROCEDURE InsertDepartment(IN depName VARCHAR(128), IN depSite VARCHAR(128))
BEGIN
    INSERT INTO Department (name, site, dep_status) VALUES (depName, depSite, '1');
END;

CREATE PROCEDURE modifyDepartmentStatus(IN depStatus VARCHAR(18))
BEGIN
    INSERT INTO Department (dep_status) VALUES (depStatus);
END;

CREATE PROCEDURE InsertUser(
  IN firstname VARCHAR(128),
  IN lastname VARCHAR(128),
  IN email VARCHAR(128),
  IN username VARCHAR(64),
  IN street_address VARCHAR(95),
  IN city VARCHAR(30),
  IN country VARCHAR(74),
  IN phone_number VARCHAR(15),
  IN birthdate DATE,
  OUT last_inserted_id INT
)
BEGIN
    INSERT INTO User (
        firstname,
        lastname,
        email,
        username,
        street_address,
        city,
        country,
        phone_number,
        birthdate
    )
    VALUES (
        firstname,
        lastname,
        email,
        username,
        street_address,
        city,
        country,
        phone_number,
        birthdate
    );

    SET last_inserted_id = LAST_INSERT_ID();
END;

CREATE PROCEDURE InsertAttendance(
    IN insertedDate DATE,
    IN username VARCHAR(64),
    OUT last_inserted_id INT
)
BEGIN
    INSERT INTO Attendance (
        user_id,
        attendance_date
    )
    VALUES (
        (SELECT id FROM User WHERE User.username = username),
        insertedDate
    );

    SET last_inserted_id = LAST_INSERT_ID();
END;

CREATE PROCEDURE GetEmployeeNamesInDepartment( # wrong
    IN departmentName VARCHAR(128),
    IN siteName VARCHAR(128)
)
BEGIN
  SELECT User.firstname, User.lastname
  FROM User
  INNER JOIN Department
  ON User.department_id = Department.id
  WHERE Department.status = '1';
END;

CREATE PROCEDURE GetDepartmentsInSite(
    IN siteName VARCHAR(128)
)
BEGIN
  SELECT name
  FROM Department
  WHERE Department.site = siteName AND Department.status = '1';
END;

CREATE PROCEDURE GetAllActiveDepartments ()
BEGIN
  SELECT name
  FROM Department
  WHERE Department.status = '1';
END;

CREATE PROCEDURE GetAllUsersByUsername (IN username VARCHAR(64))
BEGIN
  SELECT * FROM User WHERE User.username = username;
END;

CREATE PROCEDURE GetUserByID (IN uid INT)
BEGIN
  SELECT * FROM User WHERE User.id = uid;
END;

CREATE PROCEDURE GetEmailCount (IN email VARCHAR(128))
BEGIN
  SELECT COUNT(*) FROM User WHERE User.email = email;
END;

CREATE PROCEDURE GetUsernameCount (IN username VARCHAR(64))
BEGIN
    SELECT COUNT(*) FROM User WHERE User.username = username;
END;

CREATE PROCEDURE GetPhoneNumberCount (IN pnumber VARCHAR(15))
BEGIN
  SELECT COUNT(*) FROM User WHERE phone_number = pnumber;
END;

CREATE PROCEDURE GetUserRole (IN uid INT)
BEGIN
  SELECT role FROM User WHERE id = uid;
END;

CREATE PROCEDURE GetUserDepartmentAndSite (IN uid INT)
BEGIN
  SELECT name, site, dep_status FROM Department
  INNER JOIN User
  ON User.department_id = Department.id WHERE User.id = uid;
END;

CALL GetUserDepartmentAndSite(3);

CREATE PROCEDURE GetAllUsers ()
BEGIN
  SELECT id, firstname, lastname, department_id FROM User;
END;

CREATE PROCEDURE GetAllDepartments ()
BEGIN
    SELECT * FROM Department
    ORDER BY site ASC, name ASC;
END;

-- Testing
SHOW PROCESSLIST;
KILL 2612;
KILL 2475;
KILL 2496;
KILL 2532;
KILL 2544;
KILL 2553;
KILL 2563;
KILL 2593;
KILL 2596;

SELECT * FROM Department;
SELECT * FROM User;
SELECT * FROM Attendance;

DROP PROCEDURE CreateAllTables;
DROP PROCEDURE DropAllTables;

DROP PROCEDURE InsertUser;
DROP PROCEDURE InsertAttendance;

DROP PROCEDURE InsertDepartment;
DROP PROCEDURE modifyDepartmentStatus;
DROP PROCEDURE GetEmployeeNamesInDepartment;
DROP PROCEDURE GetDepartmentsInSite;
DROP PROCEDURE GetAllActiveDepartments;
DROP PROCEDURE GetAllUsersByUsername;
DROP PROCEDURE GetUserByID;
DROP PROCEDURE GetEmailCount;
DROP PROCEDURE GetUsernameCount;
DROP PROCEDURE GetPhoneNumberCount;
DROP PROCEDURE GetUserRole;
DROP PROCEDURE GetUserDepartmentAndSite;
DROP PROCEDURE GetAllUsers;
DROP PROCEDURE GetAllDepartments;

CALL DropAllTables;
CALL CreateAllTables;

CALL GetAllUsersByUsername('ahmedmk11');

CALL GetUserByID(2);

CALL InsertUser('Farah' ,'Mahmoud', 'farah@gmail.com', 'farahmk11', '13 El nour 11, 6', 'Cairo', 'Egypt', '01201201010', '2005-11-25', @pp);

CALL GetAllUsers();

CALL InsertDepartment('HR', 'Maadi Technology Park');
CALL InsertDepartment('HR', 'Smart Village');
CALL InsertDepartment('Application', 'Smart Village');
CALL GetEmployeeNamesInDepartment('HR', 'Maadi Technology Park');
CALL InsertAttendance('2023-09-12', 'ahmedmk11', @out)

CALL GetUsernameCount('ahmedmk11');

UPDATE User
SET role = 'admin'
WHERE id = 3;

ALTER TABLE Department CHANGE active dep_status VARCHAR(1);

CALL GetUserDepartmentAndSite(1);

SELECT User.id, User.name FROM User INNER JOIN Department ON User.id = Department.id;

CALL GetUserRole(1);