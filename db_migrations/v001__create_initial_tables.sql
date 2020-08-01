CREATE TABLE `chartOfAccounts` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `vertical` enum('Cultivation','Manufacture','Distribution','Retail','Delivery','Other') NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('Income','Expense') NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `plaidToAccountMapping` (
  `plaidToAccountMappingID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) NOT NULL,
  `plaidCategory` varchar(255) NOT NULL,
  PRIMARY KEY (`plaidToAccountMappingID`),
  KEY `fk_categoryID_idx` (`categoryID`),
  KEY `fk_categoryID_chartOfAccounts_idx` (`categoryID`),
  CONSTRAINT `fk_categoryID_chartOfAccounts` FOREIGN KEY (`categoryID`) REFERENCES `chartOfAccounts` (`categoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `business` (
  `businessID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `businessName` varchar(255) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `legalEntity` enum('No Entity','C Corporation','S Corporation','LLC') NOT NULL,
  PRIMARY KEY (`businessID`),
  KEY `fk_userID_idx` (`userID`),
  CONSTRAINT `fk_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `businessLocation` (
  `businessLocationID` int(11) NOT NULL AUTO_INCREMENT,
  `businessID` int(11) NOT NULL,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `vertical` enum('Cultivation','Manufacture','Distribution','Retail','Delivery','Other') NOT NULL,
  PRIMARY KEY (`businessLocationID`),
  KEY `fk_businessID_idx` (`businessID`),
  CONSTRAINT `fk_businessID` FOREIGN KEY (`businessID`) REFERENCES `business` (`businessID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `transaction` (
  `transactionID` int(11) NOT NULL AUTO_INCREMENT,
  `businessLocationID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryID` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  PRIMARY KEY (`transactionID`),
  KEY `fk_businessLocationID_idx` (`businessLocationID`),
  KEY `fk_categoryID_idx` (`categoryID`),
  CONSTRAINT `fk_businessLocationID` FOREIGN KEY (`businessLocationID`) REFERENCES `businessLocation` (`businessLocationID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_categoryID` FOREIGN KEY (`categoryID`) REFERENCES `chartOfAccounts` (`categoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
