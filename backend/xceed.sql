-- Initialization

CREATE DATABASE xceed;

USE xceed;

SHOW DATABASES ;

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
  hashed_password VARCHAR(32) NOT NULL,
  department VARCHAR(128) NOT NULL,
  site VARCHAR(128) NOT NULL,
  jobtitle VARCHAR(128),
  street_address VARCHAR(95),
  city VARCHAR(30),
  country VARCHAR(74),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  salt VARCHAR(32) NOT NULL,
  role VARCHAR(8) NOT NULL,
  date_joined DATE NOT NULL,
  birthdate DATE NOT NULL,
  employment_status VARCHAR(32) NOT NULL,
  FOREIGN KEY (department) REFERENCES Department(name)
);

-- Queries

DELIMITER //

CREATE PROCEDURE InsertDepartment(IN depName VARCHAR(128), IN depSite VARCHAR(128), IN depStatus VARCHAR(32))
BEGIN
    INSERT INTO Department (name, site, status) VALUES (depName, depSite, depStatus);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE InsertUser(
  IN firstName VARCHAR(128),
  IN lastName VARCHAR(128),
  IN email VARCHAR(128),
  IN username VARCHAR(64),
  IN hashedPassword VARCHAR(32),
  IN departmentName VARCHAR(128),
  IN siteName VARCHAR(128),
  IN jobTitle VARCHAR(128),
  IN streetAddress VARCHAR(95),
  IN city VARCHAR(30),
  IN country VARCHAR(74),
  IN phoneNumber VARCHAR(15),
  IN salt VARCHAR(32),
  IN userRole VARCHAR(8),
  IN date_joined DATE,
  IN birthdate DATE,
  IN employment_status VARCHAR(32)
)
BEGIN
  INSERT INTO User (
    firstname,
    lastname,
    email,
    username,
    hashed_password,
    department,
    site,
    jobtitle,
    street_address,
    city,
    country,
    phone_number,
    salt,
    role,
	date_joined,
	birthdate,
	employment_status
  )
  VALUES (
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    departmentName,
    siteName,
    jobTitle,
    streetAddress,
    city,
    country,
    phoneNumber,
    salt,
    userRole,
    date_joined,
	birthdate,
	employment_status
  );
END //

DELIMITER ;

DELIMITER //

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
END //

DELIMITER ;

-- Testing

SELECT * FROM User;
SELECT * FROM Department;

CALL InsertDepartment('HR', 'Maadi Technology Park', 'active');
CALL InsertDepartment('HR', 'Smart Village', 'active');
CALL InsertDepartment('Application', 'Maadi Technology Park', 'active');
CALL InsertUser('John', 'Doe', 'john.doe@email.com', 'johndoe', 'hashed_password', 'HR', 'Maadi Technology Park', 'Manager', '123 Main St', 'New York', 'USA', '1234567890', 'salt123', 'employee', '2023-01-15', '1990-05-20', 'active');
CALL InsertUser('Jane', 'Smith', 'jane.smith@email.com', 'janesmith', 'hashed_password', 'HR', 'Smart Village', 'Supervisor', '456 Elm St', 'Los Angeles', 'USA', '9876543210', 'salt456', 'employee', '2023-02-20', '1985-08-10', 'inactive');
CALL InsertUser('Alice', 'Johnson', 'alice.johnson@email.com', 'alicejohnson', 'hashed_password', 'Application', 'Maadi Technology Park', 'Developer', '789 Oak St', 'San Francisco', 'USA', '5551234567', 'salt789', 'employee', '2023-03-25', '1995-11-15', 'active');
CALL InsertUser('Bob', 'Williams', 'bob.williams@email.com', 'bobwilliams', 'hashed_password', 'HR', 'Maadi Technology Park', 'Assistant', '101 Pine St', 'Chicago', 'USA', '7778889999', 'salt101', 'employee', '2023-04-30', '1987-03-08', 'active');
CALL InsertUser('Eve', 'Brown', 'eve.brown@email.com', 'evebrown', 'hashed_password', 'Application', 'Maadi Technology Park', 'Designer', '202 Cedar St', 'Miami', 'USA', '9998887777', 'salt202', 'employee', '2023-05-10', '1992-09-25', 'inactive');
CALL GetEmployeeIDsInDepartment('HR', 'Maadi Technology Park');




