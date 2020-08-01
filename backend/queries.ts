import db from './database';
import { firstOrDefault } from './functions';

export const getBusiness = async function (
    businessId: number
): Promise<{institutionId: number}> {
    return db.queryAsync<{institutionId: number}[]>(`
        SELECT * 
        FROM business
        WHERE
            businessId = :businessId
        `,
        { businessId },
    ).then(firstOrDefault);
}