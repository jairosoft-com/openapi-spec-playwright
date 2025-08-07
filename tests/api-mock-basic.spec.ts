import { test, expect } from '@playwright/test';
import axios from 'axios';

// Configure axios to use the Prism mock server
const API_BASE_URL = 'http://127.0.0.1:4010';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mock-token' // Mock JWT token for testing
  }
});

test.describe('API Mock Server Basic Tests', () => {
  test.beforeAll(async () => {
    console.log('Make sure Prism mock server is running on http://127.0.0.1:4010');
  });

  test('should get all users', async () => {
    const response = await apiClient.get('/users');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(response.data).toHaveProperty('pagination');
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  test('should get users with pagination', async () => {
    const response = await apiClient.get('/users', {
      params: { page: 1, limit: 5 }
    });

    expect(response.status).toBe(200);
    expect(response.data.pagination).toHaveProperty('page');
    expect(response.data.pagination).toHaveProperty('limit');
    expect(response.data.pagination).toHaveProperty('total');
    expect(response.data.pagination).toHaveProperty('totalPages');
  });

  test('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const response = await apiClient.post('/users', userData);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
  });

  test('should get user by ID', async () => {
    const userId = '497f6eca-6276-4993-bfeb-53cbbbba6f08'; // Mock ID from Prism
    const response = await apiClient.get(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('name');
  });

  test('should get all todos', async () => {
    const response = await apiClient.get('/todos');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(Array.isArray(response.data.data)).toBe(true);
  });

  test('should create a new todo', async () => {
    const todoData = {
      title: 'Test Todo Item',
      userId: '497f6eca-6276-4993-bfeb-53cbbbba6f08', // Use valid UUID
      completed: false
    };

    const response = await apiClient.post('/todos', todoData);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('title');
    expect(response.data).toHaveProperty('completed');
    expect(response.data).toHaveProperty('userId');
    expect(response.data).toHaveProperty('createdAt');
    expect(response.data).toHaveProperty('updatedAt');
  });

  test('should handle authentication', async () => {
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

  test('should handle invalid user ID format', async () => {
    try {
      await apiClient.get('/users/invalid-id');
      throw new Error('Expected validation error');
    } catch (error: any) {
      // Prism might return 422 for validation errors or 404 for not found
      expect([422, 404]).toContain(error.response?.status);
    }
  });
});
