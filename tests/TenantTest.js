import http from 'k6/http';
import { check, sleep } from 'k6';
import { login } from '../api/Auth.js'; 
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

const config = JSON.parse(open('../EnvironmentSetup.json'));

export const options = {
    vus: 10,
    duration: '20s',
};

// 1. Get the token once
export function setup() {
    //taking creds from env file
    const token = login(config.BASE_URL, config.adminUser, config.adminPass); 
    return { authToken: token }; 
}

// 2. Use the token
export default function (data) {
    const url = `${config.BASE_URL}/api/tenant/all`;
    
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

// 3. Save & generating the reports akki baby
export function handleSummary(data) {
    return {
        // it will overwrite this file every time!
        "reports/warnoc_performance_report.html": htmlReport(data),
    };
}