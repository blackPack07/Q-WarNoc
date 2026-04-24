import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from '../api/Auth.js';

const config = JSON.parse(open('../EnvironmentSetup.json'));

export const options = {
    vus: 1, // Keep VUs low for lifecycle debugging
    duration: '10s',
};

export function setup() {
    const token = login(config.baseURL, config.adminUser, config.adminPass); 
    return { authToken: token }; 
}

export default function (data) {
    const params = {
        headers: {
            'Authorization': `Bearer ${data.authToken}`,
            'Content-Type': 'application/json'
        }
    };

    // STEP 1: Verify the token works (The "Life" phase)
    let res = http.get(`${config.baseURL}/api/tenant/all`, params);
    check(res, {
        'Step 1: Token works (200 OK)': (r) => r.status === 200,
    });

    // STEP 2: Log the user out (The "Death" phase)
    // Note: According to your docs, /api/user/logout requires the Auth token!
    let logoutRes = http.post(`${config.baseURL}/api/user/logout`, null, params);
    check(logoutRes, {
        'Step 2: Logout successful (200 OK)': (r) => r.status === 200,
    });

    // STEP 3: Verify the token is DEAD (Negative Validation)
    // We hit the same API from Step 1, but we EXPECT it to fail this time.
    let deadTokenRes = http.get(`${config.baseURL}/api/tenant/all`, params);
    check(deadTokenRes, {
        'Step 3: Dead token rejected (401 Unauthorized)': (r) => r.status === 401,
    });

    sleep(1);
}