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

export const updateAccessToken = async function(businessId: number, accessToken: string): Promise<any> {
    return db.queryAsync<any>(`
        UPDATE business
        SET plaidAccessToken = :accessToken
        WHERE businessId = :businessId
        LIMIT 1
        `,
        {
            businessId,
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
        SELECT * 
        FROM transaction
        JOIN chartOfAccounts
        ON transaction.categoryID = chartOfAccounts.categoryID
        WHERE
            businessLocationID = :businessLocationID
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

export const updateBusiness = async function(businessID: number, email: string, businessName: string, phoneNumber: string, legalEntity: string, password: string): Promise<any> {
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
            legalEntity,
            password
        }
    ).then(firstOrDefault);
}