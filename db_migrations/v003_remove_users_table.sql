ALTER TABLE `Production`.`business` 
DROP FOREIGN KEY `fk_userID`;
ALTER TABLE `Production`.`business` 
DROP INDEX `fk_userID_idx` ;
;

DROP TABLE `Production`.`users`;

ALTER TABLE `Production`.`business` 
DROP COLUMN `userID`,
ADD COLUMN `email` VARCHAR(45) NOT NULL AFTER `plaidAccessToken`,
ADD UNIQUE INDEX `email_UNIQUE` (`email` ASC);
;
