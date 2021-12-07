import { setUserData, getUserData, clearUserData } from "../util.js";

const host = 'http://localhost:3030';

async function request(url, options) {
    try {
        const resp = await fetch(host + url, options);
        if (resp.ok != true) {
            if (resp.status == 403) {
                sessionStorage.removeItem('userData');
            }
            const error = await resp.json();
            throw new Error(error.message);
        }
        if (resp.status == 204) {
            return resp;
        } else {
            return resp.json();
        }
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

function createOptions(method = 'get', data) {
    const options = {
        method,
        headers: {}
    }
    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }
    const userData = getUserData();
    if (userData != null) {
        options.headers['X-Authorization'] = userData.token;
    }

    return options;
}

export async function get(url) {
    return request(url, createOptions());
}

export async function post(url, data) {
    return request(url, createOptions('post', data));
}

export async function edit(url, data) {
    return request(url, createOptions('put', data));
}

export function del(url) {
    return request(url, createOptions('delete'));
}

export async function login(email, password) {
    const url = '/users/login';
    const data = {
        email,
        password
    }

    const result = await post(url, data);
    const userData = {
        email: result.email,
        id: result._id,
        token: result.accessToken        
    }
    setUserData(userData);
}

export async function register(email, password) {
    const url = '/users/register';
    const data = {
        email,
        password        
    }

    const result = await post(url, data);
    const userData = {        
        email: result.email,
        id: result._id,
        token: result.accessToken        
    }
    setUserData(userData);
} 

export async function logout() {
    await get('/users/logout');
    clearUserData();
}