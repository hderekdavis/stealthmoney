CREATE TABLE `Production`.`completedTaxReturns` (
  `completedTaxReturnID` INT NOT NULL AUTO_INCREMENT,
  `businessID` INT NOT NULL,
  `taxDueDateID` INT NOT NULL,
  PRIMARY KEY (`completedTaxReturnID`),
  INDEX `businessFK_idx` (`businessID` ASC),
  INDEX `taxDueDateFK_idx` (`taxDueDateID` ASC),
  CONSTRAINT `businessFK`
    FOREIGN KEY (`businessID`)
    REFERENCES `Production`.`business` (`businessID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `taxDueDateFK`
    FOREIGN KEY (`taxDueDateID`)
    REFERENCES `Production`.`taxesDueDates` (`dueDateID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
