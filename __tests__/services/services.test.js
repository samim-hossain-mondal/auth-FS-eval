const { loginUser } = require('../../src/services/login');
const { Users } = require('../../database/models');
const bcrypt = require('bcrypt');
const jwt = require('../../src/utils/jwt');
const redis = require('../../src/utils/redis');
const { HttpError } = require('../../src/utils/httpError');
const register = require('../../src/services/register');
const hashedPasswordGenerator = require('../../src/utils/bcrypt');
const { validateJWTToken } = require('../../src/services/validateToken');

jest.mock('../../database/models');
jest.mock('bcrypt');
jest.mock('../../src/utils/jwt');
jest.mock('../../src/utils/redis');

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not found', async () => {
    Users.findOne.mockResolvedValue(null);
    await expect(loginUser('testuser@gmail.com', 'testpassword')).rejects.toThrow(HttpError);
  });

  it('should throw an error if password is incorrect', async () => {
    const mockUser = {
      id: 1,
      email: 'testuser@gmail.com',
      password: 'testpassword',
    };
    Users.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);
    await expect(loginUser('testuser@gmail.com', 'wrongpassword')).rejects.toThrow(HttpError);
  });

  it('should return a token if login is successful', async () => {
    const mockUser = {
      id: 1,
      email: 'testuser@gmail.com',
      password: 'testpassword',
    };
    Users.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.generateJWT.mockReturnValue('testtoken');
    const result = await loginUser('testuser@gmail.com', 'testpassword');
    expect(result).toBe('testtoken');
    expect(jwt.generateJWT).toHaveBeenCalledWith({ id: 1, email: 'testuser@gmail.com' });
  });
});

jest.mock('../../database/models', () => ({
  Users: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));
jest.mock('../../src/utils/bcrypt', () => ({
  createHashedPassword: jest.fn(),
}));


describe('registerUser', () => {
  it('should create a new user', async () => {
    const email = 'testuser@gmail.com';
    const password = 'testpassword';
    const hashedPassword = 'hashedpassword';
    const newUser = { id: 1, email, password: hashedPassword };
    Users.findOne.mockReturnValue(null);
    hashedPasswordGenerator.createHashedPassword.mockResolvedValue(hashedPassword);
    Users.create.mockResolvedValue(newUser);
    const result = await register.registerUser(email, password);
    expect(Users.findOne).toHaveBeenCalledWith({
      where: {
        email: email
      }
    });
    expect(hashedPasswordGenerator.createHashedPassword).toHaveBeenCalledWith(password);
    expect(Users.create).toHaveBeenCalledWith({
      email: email,
      password: hashedPassword
    });
    expect(result).toEqual(newUser);
  });

  it('should throw an error if the user already exists', async () => {
    const email = 'existinguser';
    const password = 'testpassword';
    const existingUser = { id: 1, email, password };
    Users.findOne.mockReturnValue(existingUser);
    await expect(register.registerUser(email, password)).rejects.toThrow('User already exists');
  });

  it('should throw an error if the user could not be created', async () => {
    const email = 'testuser@gmail.com';
    const password = 'testpassword';
    const hashedPassword = 'hashedpassword';
    Users.findOne.mockReturnValue(null);
    hashedPasswordGenerator.createHashedPassword.mockResolvedValue(hashedPassword);
    Users.create.mockResolvedValue(null);
    await expect(register.registerUser(email, password)).rejects.toThrow('User could not be created');
  });
});

describe('validateJWTToken', () => {
  const token = 'someJWTToken';
  const email = 'testuser@gmail.com';
  const result = { email: email };
  beforeEach(() => {
    jwt.verifyJWT.mockReset();
    redis.getToken.mockReset();
  });

  it('throws an error if the token is not found in redis', async () => {
    jwt.verifyJWT.mockResolvedValue(result);
    redis.getToken.mockResolvedValue(null);
    await expect(validateJWTToken(token)).rejects.toThrow(new Error('Token not found in redis'));
    expect(jwt.verifyJWT).toHaveBeenCalledWith(token);
    expect(redis.getToken).toHaveBeenCalledWith(email);
  });

  it('throws an error if the jwt.verifyJWT function throws an error', async () => {
    jwt.verifyJWT.mockRejectedValue(new Error('Invalid token'));
    await expect(validateJWTToken(token)).rejects.toThrow('Invalid token');
    expect(jwt.verifyJWT).toHaveBeenCalledWith(token);
  });
});


