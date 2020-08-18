ALTER TABLE `Production`.`plaidToAccountMapping` 
ADD COLUMN `cultivationCategoryID` INT(11) NULL DEFAULT NULL AFTER `categoryID`,
ADD COLUMN `retailCategoryID` INT(11) NULL DEFAULT NULL AFTER `cultivationCategoryID`,
ADD COLUMN `manufactureCategoryID` INT(11) NULL DEFAULT NULL AFTER `retailCategoryID`,
ADD COLUMN `distributionCategoryID` INT(11) NULL DEFAULT NULL AFTER `manufactureCategoryID`,
ADD COLUMN `deliveryCategoryID` INT(11) NULL DEFAULT NULL AFTER `distributionCategoryID`;
