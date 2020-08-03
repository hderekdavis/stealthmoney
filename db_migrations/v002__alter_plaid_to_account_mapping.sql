ALTER TABLE `Production`.`plaidToAccountMapping` 
CHANGE COLUMN `plaidCategory` `plaidCategoryID` INT(11) NOT NULL ;

ALTER TABLE `Production`.`plaidToAccountMapping` 
ADD COLUMN `group` INT(11) NOT NULL AFTER `plaidCategoryID`,
ADD COLUMN `hierarchyLevel1` VARCHAR(255) NOT NULL AFTER `group`,
ADD COLUMN `hierarchyLevel2` VARCHAR(255) NULL DEFAULT NULL AFTER `hierarchyLevel1`,
ADD COLUMN `hierarchyLevel3` VARCHAR(255) NULL DEFAULT NULL AFTER `hierarchyLevel2`;

ALTER TABLE `Production`.`plaidToAccountMapping` 
CHANGE COLUMN `group` `group` VARCHAR(255) NOT NULL ;

ALTER TABLE `Production`.`business` 
ADD COLUMN `plaidAccessToken` VARCHAR(45) NULL DEFAULT NULL AFTER `legalEntity`;

ALTER TABLE `Production`.`business` 
CHANGE COLUMN `plaidAccessToken` `plaidAccessToken` VARCHAR(255) NULL DEFAULT NULL ;
