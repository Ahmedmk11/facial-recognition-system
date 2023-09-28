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
        user_picture BLOB, #
        FOREIGN KEY (department_id) REFERENCES Department(id)
    );

    CREATE TABLE Attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        attendance_date DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(id)
    );

    CREATE TABLE Notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        user1_fn VARCHAR(256) NOT NULL,
        user2_fn VARCHAR(256) NOT NULL,
        violation_date DATETIME NOT NULL,
        FOREIGN KEY (user1_id) REFERENCES User(id),
        FOREIGN KEY (user2_id) REFERENCES User(id)
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

CREATE PROCEDURE GetIDByUserName(IN uname VARCHAR(64))
BEGIN
    SELECT id FROM User WHERE username = uname;
END;

DROP PROCEDURE InsertUser

CREATE PROCEDURE InsertUser(
  IN firstname VARCHAR(128),
  IN lastname VARCHAR(128),
  IN email VARCHAR(128),
  IN username VARCHAR(64),
  IN street_address VARCHAR(95),
  IN location VARCHAR(255),
  IN phone_number VARCHAR(15),
  IN birthdate DATE,
  IN user_picture MEDIUMBLOB
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
        date_joined,
        department_id,
        user_picture
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
        CURDATE(),
        5,
        user_picture
    );
END;

DROP PROCEDURE InsertUser

CREATE PROCEDURE InsertAttendance(
    IN uid INT
)
BEGIN
    DECLARE existing_count INT;
    SELECT COUNT(*) INTO existing_count
    FROM Attendance
    WHERE user_id = uid AND DATE(attendance_date) = CURDATE();
    IF existing_count = 0 THEN
        INSERT INTO Attendance (
            user_id,
            attendance_date
        )
        VALUES (
            uid,
            NOW()
        );
        SELECT 'OK' AS result;
    ELSE
        SELECT 'OK' AS result;
    END IF;
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
  SELECT id, firstname, lastname, department_id, role, location FROM User;
END;

CREATE PROCEDURE GetAllDepartments()
BEGIN
    SELECT *,
           CASE WHEN site = 'TBA' THEN 1 ELSE 0 END AS site_order
    FROM Department
    ORDER BY site_order ASC, site ASC, name ASC;
END;

CREATE PROCEDURE GetDepartmentIDFromNameSite (IN depName VARCHAR(128), IN depSite VARCHAR(128))
BEGIN
    SELECT id FROM Department WHERE name = depName AND site = depSite;
END;

DROP PROCEDURE UpdateUser

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
    IN newImage MEDIUMBLOB,
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
        department_id = newDepartmentId,
        user_picture = newImage
    WHERE
        id = userId;

    IF debugMode THEN
        INSERT INTO DebugLog(log_text) VALUES (CONCAT('UpdateUser procedure completed for user ID ', CAST(userId AS CHAR)));
    END IF;

    SELECT 'OK' AS result;
END;

CREATE PROCEDURE GetUserAttendance(IN uidList TEXT)
BEGIN
    CREATE TEMPORARY TABLE temp_user_ids (uid INT);
    SET @startIndex = 1;
    SET @endIndex = LOCATE(',', uidList);
    WHILE @endIndex > 0 DO
        INSERT INTO temp_user_ids (uid) VALUES (CAST(SUBSTRING(uidList, @startIndex, @endIndex - @startIndex) AS SIGNED));
        SET @startIndex = @endIndex + 1;
        SET @endIndex = LOCATE(',', uidList, @startIndex);
    END WHILE;
    INSERT INTO temp_user_ids (uid) VALUES (CAST(SUBSTRING(uidList, @startIndex) AS SIGNED));
    SELECT A.*
    FROM Attendance A
    JOIN temp_user_ids T ON A.user_id = T.uid
    ORDER BY A.user_id ASC;
    DROP TEMPORARY TABLE IF EXISTS temp_user_ids;
END;

CREATE PROCEDURE GetUserPicture(IN un VARCHAR(64))
BEGIN
    SELECT user_picture FROM User WHERE username = un;
END;

CREATE PROCEDURE GetAllUsersPictures()
BEGIN
    SELECT user_picture FROM User;
END;

CREATE PROCEDURE GetAllUserIDs()
BEGIN
    SELECT id FROM User;
END;

CREATE PROCEDURE InsertNotification(IN uid1 INT, IN uid2 INT, IN fn1 VARCHAR(256), IN fn2 VARCHAR(256))
BEGIN
    DECLARE existing_records INT;

    SELECT COUNT(*) INTO existing_records
    FROM Notifications
    WHERE user1_id = uid1 AND user2_id = uid2 AND DATE(violation_date) = CURDATE();

    IF existing_records = 0 THEN
        INSERT INTO Notifications (user1_id, user2_id, user1_fn, user2_fn, violation_date)
        VALUES (uid1, uid2, fn1, fn2, NOW());
    END IF;
END;

CREATE PROCEDURE DeleteNotification(IN nid INT)
BEGIN
    # to do
END;

CREATE PROCEDURE GetAllNotifications()
BEGIN
    SELECT * FROM Notifications;
END;

CREATE PROCEDURE GetAllNotificationsFromDepartment(IN did INT)
BEGIN
    # to do
END;

-- Testing

CREATE TABLE debuglog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_text TEXT,
    created_at DATETIME
);

SHOW PROCESSLIST;
KILL 2612;

CALL GetAllDepartments();

SELECT * FROM Department;
SELECT * FROM User;
SELECT * FROM Attendance;
SELECT * FROM Notifications;

CALL InsertDepartment('TBA', 'TBA')

TRUNCATE table Notifications;

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
DROP PROCEDURE GetUserAttendance;

CALL DropAllTables;
CALL CreateAllTables;

CALL GetAllDepartments;

CALL GetAllUsersByUsername('ahmedmk11');

CALL GetUserByID(2);

CALL InsertUser('fhoheo' ,'employee', 'emD@gmaDiefl.com', 'empDef1D1', '13 El nour 11, 6', 'Cairo, Egypt', '033423243', '2005-11-25', 'tefsttt', @pp);
SELECT @pp

CALL GetAllUsers();

CALL InsertDepartment('HR', 'Maadi Technology Park');
CALL InsertDepartment('HR', 'Smart Village');
CALL InsertDepartment('Application', 'Smart Village');
CALL GetEmployeeNamesInDepartment('HR', 'Maadi Technology Park');
CALL InsertAttendance('2023-09-12', 'ahmedmk11', @out)

CALL GetUsernameCount('ahmedmk11');

UPDATE User
SET role = 'super'
WHERE username = 'amahmoud';

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

CALL GetUserAttendance(1)

CALL UpdateUser(1,'Ahmedd', 'Mahmoud', 'ahmedmahmoud1903@outlook.com', 'ahmedmk11', 'TBA', '13 El Nour', 'Cairo, Egypt', '+20155080848', 'super' , '2023-09-03', '1', 3)

ALTER TABLE User
MODIFY COLUMN user_picture MEDIUMBLOB;

TRUNCATE TABLE Notifications;
ALTER TABLE Notifications AUTO_INCREMENT = 1;
