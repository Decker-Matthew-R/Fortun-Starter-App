import { describe, it, expect } from 'vitest';
import axios from 'axios';
import { createAxiosInstance } from '../AxiosInstance.ts';

describe('axiosInstance', () => {
    it('should create an axios instance', () => {
        const instance = createAxiosInstance();

        expect(instance).toBeDefined();
        expect(instance).toHaveProperty('get');
        expect(instance).toHaveProperty('post');
        expect(instance).toHaveProperty('put');
        expect(instance).toHaveProperty('delete');
    });

    it('should set Content-Type header for POST requests', () => {
        expect(axios.defaults.headers.post['Content-Type']).toBe('application/json;charset=utf-8');
    });

    it('should set CORS Access-Control-Allow-Origin header for POST requests', () => {
        expect(axios.defaults.headers.post['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should set CORS Access-Control-Allow-Origin header for GET requests', () => {
        expect(axios.defaults.headers.get['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should enable credentials with withCredentials', () => {
        expect(axios.defaults.withCredentials).toBe(true);
    });
});
