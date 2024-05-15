import { unstable_cache as cache, unstable_noStore as noStore } from 'next/cache';
import postgres, { PostgresError } from 'postgres'

const ITEMS_PER_PAGE = 15;

export async function fetchEcbData(
    query: string,
    currentPage: number
) {
    noStore();
    const sql = postgres(process.env.POSTGRES_URL ?? '');

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    try {
        const data = await sql`
            SELECT * FROM ecb_data 
            WHERE 
            key ILIKE ${`%${query}%`} OR 
            base64 ILIKE ${`%${query}%`} OR 
            result ILIKE ${`%${query}%`} 
            ORDER BY id DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
        `;

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch ecb data.');
    } finally {
        await sql.end();
    }
}

export async function saveEcbIntent(
    key: string,
    base64?: string,
    result?: string
) {
    const sql = postgres(process.env.POSTGRES_URL ?? '');
    try {
        await sql`
            INSERT INTO ecb_data (key, base64, result)
            VALUES (${key}, ${base64 ?? 'La key no es base64.'}, ${result ?? 'Key invalida.'});
        `;
    } catch (error) {
        if(error instanceof PostgresError && error.code === '23505') {
            return false;
        }
        console.error(error);
        throw new Error('Failed to save ech intent');
    } finally {
        await sql.end();
    }
}

export async function fetchIntentsPage(query: string) {
    noStore();

    const sql = postgres(process.env.POSTGRES_URL ?? '');
    try {
        const count = await sql`SELECT COUNT(*) FROM ecb_data
        WHERE 
        key ILIKE ${`%${query}%`} OR 
        base64 ILIKE ${`%${query}%`} OR 
        result ILIKE ${`%${query}%`}
        `;

        const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    } finally {
        await sql.end();
    }
}