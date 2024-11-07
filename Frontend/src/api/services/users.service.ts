import axios from '../axios';
import { User, ApiResponse } from '../../types';

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await axios.get<User[]>('/users');
    return data;
  },

  async getById(id: number): Promise<User> {
    const { data } = await axios.get<User>(`/users/${id}`);
    return data;
  },

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { data } = await axios.post<User>('/users', user);
    return data;
  },

  async update(id: number, user: Partial<User>): Promise<User> {
    const { data } = await axios.put<User>(`/users/${id}`, user);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/users/${id}`);
  }
};