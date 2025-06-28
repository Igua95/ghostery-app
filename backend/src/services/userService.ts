import bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/usersRepository.js';

export class UserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getAllUsers() {
    return this.usersRepository.findAll();
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
  }

  async createUser(username: string, password: string) {
    const existingUser = await this.usersRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersRepository.create(username, hashedPassword);
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    };
  }

  async updateUser(id: number, data: { username?: string; password?: string }) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updateData: { username?: string; password?: string } = {};
    
    if (data.username) {
      const existingUser = await this.usersRepository.findByUsername(data.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Username already exists');
      }
      updateData.username = data.username;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.usersRepository.update(id, updateData);
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.usersRepository.delete(id);
  }
}
