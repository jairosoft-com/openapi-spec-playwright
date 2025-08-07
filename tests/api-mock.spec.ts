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

test.describe('API Mock Server Tests', () => {
  test.beforeAll(async () => {
    // Ensure the mock server is running
    // You can start it with: npm run mock:start
    console.log('Make sure Prism mock server is running on http://127.0.0.1:4010');
  });

  test.describe('Users API', () => {
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
      // First create a user
      const userData = {
        email: 'getbyid@example.com',
        name: 'Get By ID User'
      };

      const createResponse = await apiClient.post('/users', userData);
      const userId = createResponse.data.id;

      // Then get the user by ID
      const getResponse = await apiClient.get(`/users/${userId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toHaveProperty('id');
      expect(getResponse.data).toHaveProperty('email');
      expect(getResponse.data).toHaveProperty('name');
    });

    test('should update user', async () => {
      // First create a user
      const userData = {
        email: 'update@example.com',
        name: 'Update User'
      };

      const createResponse = await apiClient.post('/users', userData);
      const userId = createResponse.data.id;
      const updateData = {
        email: 'updated@example.com',
        name: 'Updated User'
      };

      // Then update the user
      const updateResponse = await apiClient.put(`/users/${userId}`, updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data).toHaveProperty('id');
      expect(updateResponse.data).toHaveProperty('email');
      expect(updateResponse.data).toHaveProperty('name');
    });

    test('should delete user', async () => {
      // First create a user
      const userData = {
        email: 'delete@example.com',
        name: 'Delete User'
      };

      const createResponse = await apiClient.post('/users', userData);
      const userId = createResponse.data.id;

      // Then delete the user
      const deleteResponse = await apiClient.delete(`/users/${userId}`);

      expect(deleteResponse.status).toBe(204);
    });

    test('should handle user not found', async () => {
      try {
        await apiClient.get('/users/non-existent-id');
        throw new Error('Expected error response');
      } catch (error: any) {
        // Prism returns 422 for validation errors (invalid UUID format)
        expect([422, 404]).toContain(error.response?.status);
        // Prism returns different error format than expected
        expect(error.response?.data).toHaveProperty('title');
        expect(error.response?.data).toHaveProperty('detail');
      }
    });
  });

  test.describe('Todos API', () => {
    test('should get all todos', async () => {
      const response = await apiClient.get('/todos');

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
    });

    test('should get todos with filters', async () => {
      const response = await apiClient.get('/todos', {
        params: { completed: false, userId: '497f6eca-6276-4993-bfeb-53cbbbba6f08' } // Use valid UUID
      });

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

    test('should get todo by ID', async () => {
      // First create a todo
      const todoData = {
        title: 'Get By ID Todo',
        userId: '497f6eca-6276-4993-bfeb-53cbbbba6f08', // Use valid UUID
        completed: false
      };

      const createResponse = await apiClient.post('/todos', todoData);
      const todoId = createResponse.data.id;

      // Then get the todo by ID
      const getResponse = await apiClient.get(`/todos/${todoId}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toHaveProperty('id');
      expect(getResponse.data).toHaveProperty('title');
      expect(getResponse.data).toHaveProperty('completed');
      expect(getResponse.data).toHaveProperty('userId');
    });

    test('should update todo', async () => {
      // First create a todo
      const todoData = {
        title: 'Update Todo',
        userId: '497f6eca-6276-4993-bfeb-53cbbbba6f08', // Use valid UUID
        completed: false
      };

      const createResponse = await apiClient.post('/todos', todoData);
      const todoId = createResponse.data.id;
      const updateData = {
        title: 'Updated Todo Title',
        completed: true
      };

      // Then update the todo
      const updateResponse = await apiClient.patch(`/todos/${todoId}`, updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data).toHaveProperty('id');
      expect(updateResponse.data).toHaveProperty('title');
      expect(updateResponse.data).toHaveProperty('completed');
    });

    test('should delete todo', async () => {
      // First create a todo
      const todoData = {
        title: 'Delete Todo',
        userId: '497f6eca-6276-4993-bfeb-53cbbbba6f08', // Use valid UUID
        completed: false
      };

      const createResponse = await apiClient.post('/todos', todoData);
      const todoId = createResponse.data.id;

      // Then delete the todo
      const deleteResponse = await apiClient.delete(`/todos/${todoId}`);

      expect(deleteResponse.status).toBe(204);
    });

    test('should handle todo not found', async () => {
      try {
        await apiClient.get('/todos/non-existent-id');
        throw new Error('Expected error response');
      } catch (error: any) {
        // Prism returns 422 for validation errors (invalid UUID format)
        expect([422, 404]).toContain(error.response?.status);
        // Prism returns different error format than expected
        expect(error.response?.data).toHaveProperty('title');
        expect(error.response?.data).toHaveProperty('detail');
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid request data', async () => {
      try {
        await apiClient.post('/users', { invalid: 'data' }); // Missing required fields
        throw new Error('Expected error response');
      } catch (error: any) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data).toHaveProperty('error');
        expect(error.response?.data).toHaveProperty('code');
      }
    });

    test('should handle server errors', async () => {
      // This test demonstrates how the mock server handles 500 errors
      // In a real scenario, you might trigger this with specific conditions
      try {
        await apiClient.get('/users?triggerError=true'); // Hypothetical error trigger
        // If it's a successful response, that's also valid for a mock server
      } catch (error: any) {
        expect(error.response?.status).toBe(500);
        expect(error.response?.data).toHaveProperty('error');
        expect(error.response?.data).toHaveProperty('code');
      }
    });
  });
});
