ALTER TABLE `Production`.`transaction` 
ADD COLUMN `address` VARCHAR(45) NULL AFTER `isManualSet`,
ADD COLUMN `city` VARCHAR(45) NULL AFTER `address`,
ADD COLUMN `region` VARCHAR(45) NULL AFTER `city`,
ADD COLUMN `rawData` JSON NULL AFTER `region`;