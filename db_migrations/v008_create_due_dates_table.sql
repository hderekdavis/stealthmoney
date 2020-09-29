CREATE TABLE `Production`.`taxesDueDates` (
  `dueDateID` INT NOT NULL AUTO_INCREMENT,
  `taxName` VARCHAR(200) NOT NULL,
  `formID` VARCHAR(100) NULL,
  `city` VARCHAR(45) NULL,
  `county` VARCHAR(45) NULL,
  `state` VARCHAR(100) NULL,
  `taxingAgency` VARCHAR(100) NOT NULL,
  `license` VARCHAR(100) NULL,
  `dueDate` VARCHAR(45) NOT NULL,
  `isFederalTax` TINYINT(1) NOT NULL,
  PRIMARY KEY (`dueDateID`));