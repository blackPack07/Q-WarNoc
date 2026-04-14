/**
 * Generates a random alphanumeric string.
 * Great for creating unique subdomains or usernames!
 */
export function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    while (length--) res += charset[Math.floor(Math.random() * charset.length)];
    return res;
}

/**
 * Generates a unique, randomized email address.
 */
export function generateRandomEmail() {
    const randomPart = generateRandomString(8);
    return `testuser_${randomPart}@gmail.com`;
}

/**
 * Helper to dynamically update a payload with unique values
 */
export function randomizeTenantPayload(basePayload) {
    // Create a copy of the payload so we don't accidentally modify the original
    let newPayload = Object.assign({}, basePayload); 
    
    // Inject random values so the API doesn't throw a "Duplicate" error
    const randomId = generateRandomString(5);
    newPayload.tenant_name = `Perf Tenant ${randomId}`;
    newPayload.subdomain = `perf-${randomId}`;
    
    return newPayload;
}