import db from './database';
import { firstOrDefault } from './functions';

export const getBusiness = async function(businessId: number): Promise<{businessId: number}> {
    return db.queryAsync<{businessId: number}[]>(`
        SELECT * 
        FROM business
        WHERE
            businessId = :businessId
        `,
        { businessId }
    ).then(firstOrDefault);
}

export const updateAccessToken = async function(email: string, accessToken: string): Promise<any> {
    let emailString = email + '%';
    return db.queryAsync<any>(`
        UPDATE business
        SET plaidAccessToken = :accessToken
        WHERE email LIKE :emailString
        LIMIT 1
        `,
        {
            emailString,
            accessToken
         }
    );
}

export const getCategories = async function(): Promise<{any}> {
    return db.queryAsync<any>(`
        SELECT * 
        FROM plaidToAccountMapping
        JOIN chartOfAccounts
        ON plaidToAccountMapping.categoryID = chartOfAccounts.categoryID
        `
    );
}

export const saveBusiness = async function(email: string, businessName: string, phoneNumber: string, legalEntity: string): Promise<any> {
    return db.queryAsync<string>(`
        INSERT INTO business
        (businessName, phoneNumber, legalEntity, email)
        VALUES (:businessName, :phoneNumber, :legalEntity, :email)`,
        {
            email,
            businessName,
            phoneNumber,
            legalEntity
         }
    );
}

export const saveBusinessLocation = async function(businessID: number, addressFirstLine: string, addressSecondLine: string, city: string, state: string, zipcode: string, vertical: string): Promise<any> {
    return db.queryAsync<string>(`
        INSERT INTO businessLocation
        (businessID, addressLine1, addressLine2, city, state, zip, vertical)
        VALUES (:businessID, :addressFirstLine, :addressSecondLine, :city, :state, :zipcode, :vertical)`,
        {
            businessID,
            addressFirstLine,
            addressSecondLine,
            city,
            state,
            zipcode,
            vertical
         }
    );
}

export const getBusinessLocationsForBusiness = async function(businessID: number): Promise<any> {
    return db.queryAsync<any>(`
        SELECT * 
        FROM businessLocation
        WHERE
            businessID = :businessID
        `,
        { businessID }
    );
}

export const getBusinessByEmail = async function(email: string): Promise<any> {
    return db.queryAsync<any>(`
        SELECT * 
        FROM business
        WHERE
            email = :email
        `,
        { email }
    ).then(firstOrDefault);
}

export const getTransactions = async function(businessLocationID: number): Promise<any> {
    return db.queryAsync<any>(`
        SELECT
        amount,
        businessLocationID,
        chartOfAccounts.categoryID,
        date,
        transaction.name as name,
        chartOfAccounts.name as account,
        transactionID,
        type,
        vertical
        FROM transaction
        JOIN chartOfAccounts
        ON transaction.categoryID = chartOfAccounts.categoryID
        WHERE
            businessLocationID = :businessLocationID
        ORDER BY date DESC;
        `,
        { businessLocationID }
    );
}

export const getSalesTransactions = async function(businessLocationID: number): Promise<any> {
    return db.queryAsync<any>(`
        SELECT
        amount,
        businessLocationID,
        chartOfAccounts.categoryID,
        date,
        transaction.name as name,
        chartOfAccounts.name as account,
        transactionID,
        type,
        vertical
        FROM transaction
        JOIN chartOfAccounts
        ON transaction.categoryID = chartOfAccounts.categoryID
        WHERE
            businessLocationID = :businessLocationID AND chartOfAccounts.subType = 'Sales';
        `,
        { businessLocationID }
    );
}

export const saveTransaction = async function(businessLocationID: number, name: string, categoryID: number, amount: number, date: string): Promise<any> {
    return db.queryAsync<any>(`
        INSERT INTO transaction
        (businessLocationID, name, categoryID, amount, date)
        VALUES (:businessLocationID, :name, :categoryID, :amount, :date)`,
        {
            businessLocationID,
            name,
            categoryID,
            amount,
            date
        }
    );
}

export const saveTransactions = async function(transactions: any): Promise<any> {
    let query = '';
    transactions.forEach((item, index) => {
        query += '(' + item.businessLocationID + ', "' + item.transactionName + '", ' + item.categoryID  + ', ' + item.amount + ', "' + item.date + '")';
        if (index < (transactions.length - 1)) {
            query += ',';
        } else {
            query += ';';
        }
    });
    return db.queryAsync<any>(`
        INSERT INTO transaction
        (businessLocationID, name, categoryID, amount, date)
        VALUES ` + query);
}

export const updateBusiness = async function(businessID: number, email: string, businessName: string, phoneNumber: string, legalEntity: string): Promise<any> {
    return db.queryAsync<any>(`
        UPDATE business
        SET email = :email,
        businessName =:businessName,
        phoneNumber =:phoneNumber,
        legalEntity =:legalEntity
        WHERE
            businessID = :businessID
        `,
        { 
            businessID,
            email,
            businessName,
            phoneNumber,
            legalEntity
        }
    ).then(firstOrDefault);
}

export const getChartOfAccountsCategories = async function(vertical: string): Promise<any> {
    return db.queryAsync<any>(`
        SELECT * 
        FROM chartOfAccounts
        WHERE vertical = :vertical
        ORDER BY name ASC;
        `,
        { 
            vertical
        }
    );
}

export const getBusinessLocation = async function(email: string): Promise<any> {
    let emailString = email + '%';
    return db.queryAsync<any>(`
        SELECT * 
        FROM businessLocation
        JOIN business
        ON businessLocation.businessID = business.businessID
        WHERE email LIKE :emailString
        `,
        {
            emailString
        }).then(firstOrDefault);
}

export const updateTransaction = async function(transaction: any): Promise<any> {
    let categoryID = parseInt(transaction.categoryId);
    let transactionID = parseInt(transaction.transactionId);
    return db.queryAsync<any>(`
        UPDATE transaction
        SET categoryID = :categoryID,
            isManualSet = 1
        WHERE
            transactionID = :transactionID
        `,
        { 
            categoryID,
            transactionID
        });
}

export const getBusinessPlaidToken = async function(email: string): Promise<any> {
    let emailString = email + '%';
    return db.queryAsync<any>(`
        SELECT plaidAccessToken 
        FROM business
        WHERE email LIKE :emailString
        `,
        {
            emailString
        }).then(firstOrDefault);
}

export const getBusinessLatestCategoryForTransaction = async function(transactionName: string, businessLocationID: number): Promise<any> {
    return db.queryAsync<any>(`
        SELECT  categoryID
        FROM     Production.transaction
        WHERE name = :transactionName AND isManualSet = 1 AND businessLocationID = :businessLocationID
        LIMIT 1;
        `,
        {
            businessLocationID,
            transactionName
        }).then(firstOrDefault);
}

export const getGeneralMostFrequentCategoryForTransaction = async function(transactionName: string): Promise<any> {
    return db.queryAsync<any>(`
        SELECT  categoryID, COUNT(categoryID) AS 'value_occurrence' 
        FROM     Production.transaction
        WHERE name = :transactionName AND isManualSet = 1
        GROUP BY categoryID
        ORDER BY 'value_occurrence' DESC
        LIMIT    1;
        `,
        {
            transactionName
        }).then(firstOrDefault);
}

export const getDefaultCategoryForTransaction = async function(plaidCategoryID: number, businessVertical: string): Promise<any> {
    switch(businessVertical) {
        case 'Cultivation':
            return db.queryAsync<any>(`
                SELECT cultivationCategoryID
                FROM plaidToAccountMapping
                WHERE plaidCategoryID = :plaidCategoryID
                `,
                {
                    plaidCategoryID
                }).then(firstOrDefault).then(result => { return result['cultivationCategoryID'] });
        case 'Distribution':
            return db.queryAsync<any>(`
                SELECT distributionCategoryID
                FROM plaidToAccountMapping
                WHERE plaidCategoryID = :plaidCategoryID
                `,
                {
                    plaidCategoryID
                }).then(firstOrDefault).then(result => { return result['distributionCategoryID'] });
        case 'Retail':
            return db.queryAsync<any>(`
                SELECT retailCategoryID
                FROM plaidToAccountMapping
                WHERE plaidCategoryID = :plaidCategoryID
                `,
                {
                    plaidCategoryID
                }).then(firstOrDefault).then(result => { return result['retailCategoryID'] });
        case 'Manufacture':
            return db.queryAsync<any>(`
                SELECT manufactureCategoryID
                FROM plaidToAccountMapping
                WHERE plaidCategoryID = :plaidCategoryID
                `,
                {
                    plaidCategoryID
                }).then(firstOrDefault).then(result => { return result['manufactureCategoryID'] });
        case 'Delivery':
            return db.queryAsync<any>(`
                SELECT deliveryCategoryID
                FROM plaidToAccountMapping
                WHERE plaidCategoryID = :plaidCategoryID
                `,
                {
                    plaidCategoryID
                }).then(firstOrDefault).then(result => { return result['deliveryCategoryID'] });
      }
}

export const getCategoryForTransaction = async function(transactionName: string, businessLocationID: number, businessVertical: string, plaidCategoryID: number): Promise<any> {
    try {
        let category = await getBusinessLatestCategoryForTransaction(transactionName, businessLocationID);
        if (!category) {
            category = await getGeneralMostFrequentCategoryForTransaction(transactionName);
        } 
        if (!category) {
            category = await getDefaultCategoryForTransaction(plaidCategoryID, businessVertical);
        } else {
            category = category['categoryID'];
        }
        return category;
    } catch(error) {
        console.log(error);
    }
}

export const updateSimilarTransactionsForUser = async function(transactionName: string, categoryID: number, businessLocationID: number): Promise<any> {
    try {
        return db.queryAsync<any>(`
            UPDATE transaction
            SET categoryID = :categoryID
            WHERE name = :transactionName AND businessLocationID = :businessLocationID AND isManualSet = 0
            `,
            {
                categoryID,
                transactionName,
                businessLocationID
            })
    } catch(error) {
        console.log(error);
    }
}

export const getStateTax = async function(state: string): Promise<any> {
    try {
        return db.queryAsync<any>(`
            SELECT singleRate, singleBracket
            FROM stateTaxes
            WHERE state = :state
            `,
            {
                state
            });
    } catch(error) {
        console.log(error);
    }
}

export const getIndividualTaxes = async function(): Promise<any> {
    try {
        return db.queryAsync<any>(`
            SELECT rate, bracket
            FROM individualTaxes
            `,
        );
    } catch(error) {
        console.log(error);
    }
}

export const dropBusinessTransactions = async function(businessLocationID: number): Promise<any> {
    try {
        return db.queryAsync<any>(`
            DELETE FROM transaction
            WHERE businessLocationID = :businessLocationID
            `,{
                businessLocationID
            });
    } catch(error) {
        console.log(error);
    }
}