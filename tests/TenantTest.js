import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from '../api/Auth.js'; 
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = 'http://localhost:8080'; 

export const options = {
    vus: 1000,
    duration: '120s',
};

// 1. Get the token once
export function setup() {
    // Replace with your actual Warnoc test credentials
    const token = login(BASE_URL, 'dhruv', 'dhruv@123'); 
    return { authToken: token }; 
}

// 2. Use the token
export default function (data) {
    const url = `${BASE_URL}/api/tenant/all`;
    
    const params = {
        headers: {
            'Authorization': `Bearer ${data.authToken}`,
            'Content-Type': 'application/json'
        }
    };

    const res = http.get(url, params);

    check(res, {
        'Get Tenants passed': (r) => r.status === 200,
    });
    sleep(1);
}

// 3. Save to the reports folder
export function handleSummary(data) {
    return {
        // it will overwrite this file every time!
        "reports/warnoc_performance_report.html": htmlReport(data),
    };
}