import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { hash, compare, genSalt, hashSync, genSaltSync } from 'bcryptjs';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createHash(password) {
    return await hash(password, await genSalt(10));
}

export async function isValidPassword(password, hashedPassword) {
    return await compare(password, hashedPassword);
}

export function generateTicketCode(prefix = 'TCK') {
    const rawData = `${Date.now()}-${Math.random()}`;
    const hashed = hashSync(rawData, genSaltSync(10));
    const cleanCode = hashed.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase();
    return `${prefix}-${cleanCode}`;
}