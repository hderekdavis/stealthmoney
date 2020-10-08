CREATE TABLE `Production`.`businessAccountants` (
  `businessAccountantID` INT NOT NULL AUTO_INCREMENT,
  `businessID` INT NOT NULL,
  `accountantID` INT NOT NULL,
  PRIMARY KEY (`businessAccountantID`),
  INDEX `businessFK_idx` (`businessID` ASC),
  INDEX `accountantID_idx` (`accountantID` ASC),
  CONSTRAINT `businessAccountantFK`
    FOREIGN KEY (`businessID`)
    REFERENCES `Production`.`business` (`businessID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `accountantBusinessFK`
    FOREIGN KEY (`accountantID`)
    REFERENCES `Production`.`accountants` (`accountantID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
