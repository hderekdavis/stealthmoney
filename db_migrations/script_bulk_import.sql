LOAD DATA LOCAL INFILE "E:/Laburo/1947-Partition-Archive/extras/Tax_Deadline_Tracker.csv" INTO TABLE taxesDueDates
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(taxName, formID, city, county, state, taxingAgency, license, dueDate, isFederalTax, frequency, entity)