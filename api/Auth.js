import http from 'k6/http';
import { check } from 'k6';

// Logs into the Warnoc API and returns the Bearer token.
export function login(baseURL, userEmail, userPassword) {
    const loginUrl = `${baseURL}/api/user/login`;
    
    const payload = JSON.stringify({
        email: userEmail,
        password: userPassword
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // POST request
    const res = http.post(loginUrl, payload, params);

    // Assert that the login was successful
    check(res, {
        'Login successful (200 OK)': (r) => r.status === 200,
        'Token is present': (r) => r.json('token') !== undefined,
    });

    // token string
    return res.json('token'); 
}