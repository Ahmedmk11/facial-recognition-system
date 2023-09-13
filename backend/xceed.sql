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
        status VARCHAR(32) NOT NULL,
        UNIQUE KEY unique_department_site (name, site)
    );

    CREATE TABLE User (
        id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
        firstname VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        department VARCHAR(128),
        site VARCHAR(128),
        jobtitle VARCHAR(128),
        street_address VARCHAR(95) NOT NULL,
        city VARCHAR(30) NOT NULL,
        country VARCHAR(74) NOT NULL,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        role VARCHAR(8),
        date_joined DATE,
        birthdate DATE NOT NULL,
        employment_status VARCHAR(32),
        embedding BLOB,
        FOREIGN KEY (department, site) REFERENCES Department(name, site)
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
    DROP TABLE Attendance;
    DROP TABLE User;
    DROP TABLE Department;
END;

CREATE PROCEDURE InsertDepartment(IN depName VARCHAR(128), IN depSite VARCHAR(128), IN depStatus VARCHAR(32))
BEGIN
    INSERT INTO Department (name, site, status) VALUES (depName, depSite, depStatus);
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

CREATE PROCEDURE GetEmployeeIDsInDepartment(
    IN departmentName VARCHAR(128),
    IN siteName VARCHAR(128)
)
BEGIN
  SELECT User.id
  FROM User
  INNER JOIN Department
  ON User.department = Department.name AND User.site = Department.site
  WHERE Department.name = departmentName AND Department.site = siteName AND Department.status = 'active';
END;

-- Testing

SELECT * FROM User;
SELECT * FROM Department;
SELECT * FROM Attendance;

DROP PROCEDURE InsertUser
DROP PROCEDURE InsertDepartment
DROP PROCEDURE GetEmployeeIDsInDepartment
DROP PROCEDURE CreateAllTables
DROP PROCEDURE DropAllTables
DROP PROCEDURE InsertAttendance

CALL DropAllTables
CALL CreateAllTables

CALL InsertDepartment('HR', 'Maadi Technology Park', 'active');
CALL InsertDepartment('HR', 'Smart Village', 'active');
CALL InsertDepartment('Application', 'Maadi Technology Park', 'active');
CALL GetEmployeeIDsInDepartment('HR', 'Maadi Technology Park');
CALL InsertAttendance('2023-09-12', 'ahmedmk11', @out)