ALTER TABLE `Production`.`taxesDueDates` 
ADD COLUMN `frequency` INT NULL AFTER `isFederalTax` NULL DEFAULT NULL;