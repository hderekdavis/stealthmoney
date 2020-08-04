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