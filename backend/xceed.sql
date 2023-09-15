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
        active VARCHAR(1) NOT NULL
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
    INSERT INTO Department (name, site, status) VALUES (depName, depSite, '1');
END;

CREATE PROCEDURE modifyDepartmentStatus(IN depStatus VARCHAR(18))
BEGIN
    INSERT INTO Department (status) VALUES (depStatus);
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

CREATE PROCEDURE GetEmployeeNamesInDepartment(
    IN departmentName VARCHAR(128),
    IN siteName VARCHAR(128)
)
BEGIN
  SELECT User.name
  FROM User
  INNER JOIN Department
  ON User.department_id = Department.id
  WHERE Department.status = 'active';
END;

CREATE PROCEDURE GetDepartmentsInSite(
    IN siteName VARCHAR(128)
)
BEGIN
  SELECT name
  FROM Department
  WHERE Department.site = siteName AND Department.status = 'active';
END;

CREATE PROCEDURE GetAllActiveDepartments ()
BEGIN
  SELECT name
  FROM Department
  WHERE Department.status = 'active';
END;

CREATE PROCEDURE GetAllDepartments ()
BEGIN
  SELECT name
  FROM Department;
END;

CREATE PROCEDURE GetAllUsersByUsername (IN username VARCHAR(64))
BEGIN
  SELECT * FROM User WHERE User.username = username;
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

CREATE PROCEDURE GetUserRole (IN uid VARCHAR(8))
BEGIN
  SELECT role FROM User WHERE id = uid;
END;

-- Testing
SHOW PROCESSLIST;
KILL 504;
KILL 505;
KILL 507;
KILL 514;
KILL 516;

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
DROP PROCEDURE GetAllDepartments;
DROP PROCEDURE GetAllUsersByUsername;
DROP PROCEDURE GetEmailCount;
DROP PROCEDURE GetUsernameCount;
DROP PROCEDURE GetPhoneNumberCount;
DROP PROCEDURE GetUserRole;

CALL DropAllTables;
CALL CreateAllTables;

CALL InsertDepartment('HR', 'Maadi Technology Park', 'active');
CALL InsertDepartment('HR', 'Smart Village', 'active');
CALL InsertDepartment('Application', 'Maadi Technology Park', 'active');
CALL GetEmployeeNamesInDepartment('HR', 'Maadi Technology Park');
CALL InsertAttendance('2023-09-12', 'ahmedmk11', @out)

CALL GetUsernameCount('ahmedmk11');

UPDATE User
SET role = 'super'
WHERE User.id = 1;


SELECT User.id, User.name FROM User INNER JOIN Department ON User.id = Department.id;

CALL GetUserRole(1);