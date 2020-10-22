ALTER TABLE `Production`.`business` 
ADD COLUMN `unsuscribeEmails` TINYINT NOT NULL DEFAULT 0 AFTER `plaidLastPull`;
