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
        id INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY, #
        firstname VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        username VARCHAR(64) UNIQUE NOT NULL,
        jobtitle VARCHAR(128), #
        street_address VARCHAR(95) NOT NULL,
        location VARCHAR(255) NOT NULL,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        role VARCHAR(8),
        date_joined DATE,
        birthdate DATE NOT NULL,
        employment_status VARCHAR(32),
        department_id INT, #
        embedding BLOB, #
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
  IN location VARCHAR(255),
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
        location,
        phone_number,
        birthdate,
        role,
        employment_status,
        date_joined
    )
    VALUES (
        firstname,
        lastname,
        email,
        username,
        street_address,
        location,
        phone_number,
        birthdate,
        'employee',
        '1',
        CURDATE()
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

CREATE PROCEDURE GetAllUsers ()
BEGIN
  SELECT id, firstname, lastname, department_id, role FROM User;
END;

CREATE PROCEDURE GetAllDepartments ()
BEGIN
    SELECT * FROM Department
    ORDER BY site ASC, name ASC;
END;

CREATE PROCEDURE GetDepartmentIDFromNameSite (IN depName VARCHAR(128), IN depSite VARCHAR(128))
BEGIN
    SELECT id FROM Department WHERE name = depName AND site = depSite;
END;

CREATE PROCEDURE UpdateUser(
    IN userId INT,
    IN newFirstname VARCHAR(128),
    IN newLastname VARCHAR(128),
    IN newEmail VARCHAR(128),
    IN newUsername VARCHAR(64),
    IN newJobtitle VARCHAR(128),
    IN newStreetAddress VARCHAR(95),
    IN newLocation VARCHAR(255),
    IN newPhoneNumber VARCHAR(15),
    IN newRole VARCHAR(8),
    IN newBirthdate DATE,
    IN newEmploymentStatus VARCHAR(32),
    IN newDepartmentId INT,
    IN debugMode BOOLEAN
)
BEGIN
    IF debugMode THEN
        INSERT INTO DebugLog(log_text) VALUES (CONCAT('Calling UpdateUser procedure for user ID ', CAST(userId AS CHAR)));
    END IF;

    UPDATE User
    SET
        firstname = newFirstname,
        lastname = newLastname,
        email = newEmail,
        username = newUsername,
        jobtitle = newJobtitle,
        street_address = newStreetAddress,
        location = newLocation,
        phone_number = newPhoneNumber,
        role = newRole,
        birthdate = newBirthdate,
        employment_status = newEmploymentStatus,
        department_id = newDepartmentId
    WHERE
        id = userId;

    IF debugMode THEN
        INSERT INTO DebugLog(log_text) VALUES (CONCAT('UpdateUser procedure completed for user ID ', CAST(userId AS CHAR)));
    END IF;

    -- Add a SELECT statement to return a result set
    SELECT 'OK' AS result;
END;

DROP PROCEDURE UpdateUser;


CREATE TABLE debuglog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_text TEXT,
    created_at DATETIME
);
-- Testing

SHOW PROCESSLIST;
KILL 2612;

CALL GetAllDepartments();

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
DROP PROCEDURE UpdateUser;

CALL DropAllTables;
CALL CreateAllTables;

CALL GetAllDepartments;

CALL GetAllUsersByUsername('ahmedmk11');

CALL GetUserByID(2);

CALL InsertUser('hoho' ,'employee', 'em@gmail.com', 'emp11', '13 El nour 11, 6', 'Cairo', 'Egypt', '0120120142243', '2005-11-25', @pp);

CALL GetAllUsers();

CALL InsertDepartment('HR', 'Maadi Technology Park');
CALL InsertDepartment('HR', 'Smart Village');
CALL InsertDepartment('Application', 'Smart Village');
CALL GetEmployeeNamesInDepartment('HR', 'Maadi Technology Park');
CALL InsertAttendance('2023-09-12', 'ahmedmk11', @out)

CALL GetUsernameCount('ahmedmk11');

UPDATE User
SET role = 'employee'
WHERE id = 4;

ALTER TABLE Department CHANGE active dep_status VARCHAR(1);

CALL GetUserDepartmentAndSite(1);

SELECT User.id, User.name FROM User INNER JOIN Department ON User.id = Department.id;

CALL GetUserRole(1);

ALTER TABLE User
DROP COLUMN city,
DROP COLUMN country;

ALTER TABLE User
ADD COLUMN location VARCHAR(255);

SELECT * FROM User;

CALL UpdateUser(1,'Ahmedd', 'Mahmoud', 'ahmedmahmoud1903@outlook.com', 'ahmedmk11', 'TBA', '13 El Nour', 'Cairo, Egypt', '+20155080848', 'super' , '2023-09-03', '1', 3)