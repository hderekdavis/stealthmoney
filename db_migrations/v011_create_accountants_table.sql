CREATE TABLE `Production`.`accountants` (
  `accountantID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(100) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phoneNumber` VARCHAR(45) NULL,
  PRIMARY KEY (`accountantID`));