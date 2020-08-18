ALTER TABLE `Production`.`transaction` 
ADD COLUMN `isManualSet` TINYINT(1) NOT NULL DEFAULT 0 AFTER `date`;