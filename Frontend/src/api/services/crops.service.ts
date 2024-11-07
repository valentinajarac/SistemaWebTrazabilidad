import axios from '../axios';
import { Crop } from '../../types';

export const cropService = {
  async getByUserId(userId: number): Promise<Crop[]> {
    const { data } = await axios.get<Crop[]>(`/crops/user/${userId}`);
    return data;
  },

  async getByFarmId(farmId: number): Promise<Crop[]> {
    const { data } = await axios.get<Crop[]>(`/crops/farm/${farmId}`);
    return data;
  },

  async getById(id: number): Promise<Crop> {
    const { data } = await axios.get<Crop>(`/crops/${id}`);
    return data;
  },

  async create(crop: Omit<Crop, 'id'>): Promise<Crop> {
    const { data } = await axios.post<Crop>('/crops', crop);
    return data;
  },

  async update(id: number, crop: Partial<Crop>): Promise<Crop> {
    const { data } = await axios.put<Crop>(`/crops/${id}`, crop);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/crops/${id}`);
  }
};