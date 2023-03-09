const { handleLogin } = require('../../src/controllers/login');
const login = require('../../src/services/login');
const { handleRegistration } = require('../../src/controllers/register');
const register = require('../../src/services/register');
const validateToken = require('../../src/services/validateToken');
const jwt = require('../../src/utils/jwt');
const redis = require('../../src/utils/redis');

jest.mock('../../src/services/login');
jest.mock('../../src/services/register');

describe('handleLogin', () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@gmail.com',
        password: 'testpassword'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should respond with status 200 and token if login is successful', async () => {
    const token = 'testtoken';
    login.loginUser.mockResolvedValueOnce(token);
    await handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User logged in successfully',
      data: token
    });
  });
});

describe('handleRegistration', () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@gmail.com',
        password: 'testpassword'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return status 201 and created user data on successful user creation', async () => {
    const createdUser = { id: 1, email: 'testuser@gmail.com' };
    register.registerUser.mockResolvedValue(createdUser);
    await handleRegistration(req, res);
    expect(register.registerUser).toHaveBeenCalledWith('testuser@gmail.com', 'testpassword');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', data: createdUser });
  });

  it('should return status 500 and error message on unsuccessful user creation', async () => {
    const errorMessage = 'Error creating user';
    register.registerUser.mockRejectedValue(new Error(errorMessage));
    await handleRegistration(req, res);
    expect(register.registerUser).toHaveBeenCalledWith('testuser@gmail.com', 'testpassword');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage, error: expect.any(Error) });
  });
});

describe('validateToken', () => {
  test('should throw an error if token is not valid', async () => {
    const token = 'invalid_token';
    jwt.verifyJWT = jest.fn().mockRejectedValue(new Error('Invalid token'));
    await expect(validateToken.validateJWTToken(token)).rejects.toThrow('Invalid token');
  });

  test('should throw an error if token is not found in redis', async () => {
    const token = 'valid_token';
    const email = 'testuser@gmail.com';
    const decodedToken = { email };
    jwt.verifyJWT = jest.fn().mockResolvedValue(decodedToken);
    redis.getToken = jest.fn().mockResolvedValue(null);
    await expect(validateToken.validateJWTToken(token)).rejects.toThrow('Token not found in redis');
  });

  test('should return the decoded token if it is valid and found in redis', async () => {
    const token = 'valid_token';
    const email = 'testuser@gmail.com';
    const decodedToken = { email };
    jwt.verifyJWT = jest.fn().mockResolvedValue(decodedToken);
    redis.getToken = jest.fn().mockResolvedValue(token);
    const result = await validateToken.validateJWTToken(token);
    expect(result).toEqual(decodedToken);
  });
});




