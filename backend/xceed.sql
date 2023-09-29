-- Initialization

CREATE DATABASE xceed;

USE xceed;

SHOW DATABASES;

-- Procedures Creation

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
        department_id INT,
        user_picture MEDIUMBLOB,
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

CREATE PROCEDURE GetIDByUserName(IN uname VARCHAR(64))
BEGIN
    SELECT id FROM User WHERE username = uname;
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
        VALUES (uid1, uid2, fn1, fn2, NOW(), '0');
    END IF;
END;

CREATE PROCEDURE DeleteNotification(IN nid INT)
BEGIN
    UPDATE Notifications
    SET
        isHandled = '1'
    WHERE
        id = nid;
END;

CREATE PROCEDURE GetAllNotifications()
BEGIN
    SELECT * FROM Notifications;
END;

CREATE PROCEDURE GetAllNotificationsForAdmin(IN did INT)
BEGIN
    SELECT n.id, n.user1_id, n.user2_id, n.user1_fn, n.user2_fn, n.violation_date, isHandled FROM Notifications AS n
    INNER JOIN User AS u1 ON n.user1_id = u1.id 
    INNER JOIN User AS u2 ON n.user2_id = u2.id 
    WHERE (u1.department_id = did OR u2.department_id = did);
END;

CREATE PROCEDURE UpdateDepartment(IN did INT, IN newName VARCHAR(128), IN newSite VARCHAR(128), IN newStatus VARCHAR(1))
BEGIN
    UPDATE Department
    SET
        name = newName,
        site = newSite,
        dep_status = newStatus
    WHERE
        id = did;
END;

-- Testing

CREATE TABLE debuglog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_text TEXT,
    created_at DATETIME
);

SHOW PROCESSLIST;

CALL GetAllDepartments();

SELECT * FROM Department;
SELECT * FROM User;
SELECT * FROM Attendance;
SELECT * FROM Notifications;

TRUNCATE table Notifications;

DROP PROCEDURE CreateAllTables
DROP PROCEDURE DropAllTables
DROP PROCEDURE InsertDepartment
DROP PROCEDURE GetIDByUserName
DROP PROCEDURE InsertUser
DROP PROCEDURE InsertAttendance
DROP PROCEDURE GetAllUsersByUsername
DROP PROCEDURE GetUserByID
DROP PROCEDURE GetEmailCount
DROP PROCEDURE GetUsernameCount
DROP PROCEDURE GetPhoneNumberCount
DROP PROCEDURE GetUserRole
DROP PROCEDURE GetUserDepartmentAndSite
DROP PROCEDURE GetAllUsers
DROP PROCEDURE GetAllDepartments
DROP PROCEDURE GetDepartmentIDFromNameSite
DROP PROCEDURE UpdateUser
DROP PROCEDURE GetUserAttendance
DROP PROCEDURE GetUserPicture
DROP PROCEDURE GetAllUsersPictures
DROP PROCEDURE GetAllUserIDs
DROP PROCEDURE InsertNotification
DROP PROCEDURE DeleteNotification
DROP PROCEDURE GetAllNotifications
DROP PROCEDURE GetAllNotificationsForAdmin
DROP PROCEDURE UpdateDepartment

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

ALTER TABLE User
MODIFY COLUMN user_picture MEDIUMBLOB;

TRUNCATE TABLE Notifications;
ALTER TABLE Notifications AUTO_INCREMENT = 1;

ALTER TABLE Notifications
ADD isHandled VARCHAR(1);

UPDATE Notifications
SET isHandled = 0;
