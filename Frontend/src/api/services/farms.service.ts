import axios from '../axios';
import { Farm } from '../../types';

export const farmService = {
  async getByUserId(userId: number): Promise<Farm[]> {
    const { data } = await axios.get<Farm[]>(`/farms/user/${userId}`);
    return data;
  },

  async getById(id: number): Promise<Farm> {
    const { data } = await axios.get<Farm>(`/farms/${id}`);
    return data;
  },

  async create(farm: Omit<Farm, 'id'>): Promise<Farm> {
    const { data } = await axios.post<Farm>('/farms', farm);
    return data;
  },

  async update(id: number, farm: Partial<Farm>): Promise<Farm> {
    const { data } = await axios.put<Farm>(`/farms/${id}`, farm);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/farms/${id}`);
  }
};