import { test, expect } from '@playwright/test';
import axios from 'axios';

// Configure axios to use the Prism mock server
const API_BASE_URL = 'http://127.0.0.1:4010';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-token'
  }
});

test.describe('Prism Mock Server Demo', () => {
  test('should connect to Prism mock server', async () => {
    const response = await apiClient.get('/users');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(response.data).toHaveProperty('pagination');
    expect(Array.isArray(response.data.data)).toBe(true);
    
    console.log('✅ Prism mock server is working!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  });

  test('should create a user via Prism', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const response = await apiClient.post('/users', userData);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('name');
    
    console.log('✅ User creation via Prism works!');
    console.log('Created user:', JSON.stringify(response.data, null, 2));
  });

  test('should get todos via Prism', async () => {
    const response = await apiClient.get('/todos');
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(Array.isArray(response.data.data)).toBe(true);
    
    console.log('✅ Todo retrieval via Prism works!');
    console.log('Todos:', JSON.stringify(response.data, null, 2));
  });

  test('should handle authentication properly', async () => {
    // Test with valid auth
    const validResponse = await apiClient.get('/users');
    expect(validResponse.status).toBe(200);
    
    // Test without auth
    try {
      await axios.get(`${API_BASE_URL}/users`);
      throw new Error('Expected authentication error');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      console.log('✅ Authentication is working properly!');
    }
  });
});
