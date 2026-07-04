const request = require('supertest');
const app = require('../server');

jest.mock('../firebaseHelper', () => {
  const users = [];
  return {
    db_ops: {
      getUserByEmail: jest.fn(async (email) => users.find(u => u.email === email) || null),
      createUser: jest.fn(async (userData) => { users.push({ id: `${users.length+1}`, ...userData }); return { id: `${users.length}`, ...userData }; }),
      getUserById: jest.fn(async (id) => users.find(u => u.id === id) || null)
    }
  };
});

const { db_ops } = require('../firebaseHelper');

describe('Auth endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/signup creates a user', async () => {
    const payload = {
      employeeId: 'EMP100',
      email: 'newuser@example.com',
      password: 'Test123!A',
      role: 'Employee'
    };

    const res = await request(app).post('/api/auth/signup').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(db_ops.getUserByEmail).toHaveBeenCalledWith(payload.email);
  });

  test('POST /api/auth/signin with valid user returns token', async () => {
    // seed a user via the mocked createUser
    await db_ops.createUser({ employeeId: 'EMP101', email: 'signin@example.com', password: 'SignIn1!', role: 'Employee', verified: true, profile: {} });

    const res = await request(app).post('/api/auth/signin').send({ email: 'signin@example.com', password: 'SignIn1!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
