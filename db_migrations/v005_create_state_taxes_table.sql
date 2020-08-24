CREATE TABLE `Production`.`stateTaxes` (
  `taxID` INT NOT NULL AUTO_INCREMENT,
  `state` VARCHAR(45) NOT NULL,
  `singleRate` DECIMAL(6,5) NOT NULL,
  `singleBracket` DECIMAL(13,2) NOT NULL,
  PRIMARY KEY (`taxID`));