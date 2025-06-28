import bcrypt from 'bcryptjs';
import { UsersRepository } from '../repositories/usersRepository.js';

export class UserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
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
}
