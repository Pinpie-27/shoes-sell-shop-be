import { usersModel } from "../models/users.model";

import type { User } from "../models/users.model";
const bcrypt = require("bcrypt");
class UsersService {
  async loginUser(username: string, password: string) {
    const user = await usersModel.findByUserName(username);
    if (!user) throw "Username is incorrect";

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw "Password is incorrect";

    return user;
  }

  async getAllUsers() {
    return await usersModel.getAllUsers();
  }

  async getUserById(id: number) {
    return await usersModel.findById(id);
  }

  async createUser(newUser: Partial<User>): Promise<number> {
    return await usersModel.createUser(newUser);
  }

  async deleteUser(id: number) {
    return await usersModel.deleteUser(id);
  }

  async updateUser(id: number, updatedFields: Partial<User>) {
    return await usersModel.updateUser(id, updatedFields);
  }

  async searchUser(keyword: string) {
    return await usersModel.searchByUserName(keyword);
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return await usersModel.findUserByUsername(username);
  }
}

export const usersService = new UsersService();
