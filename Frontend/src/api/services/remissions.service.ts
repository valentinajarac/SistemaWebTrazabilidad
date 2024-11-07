import axios from '../axios';
import { Remission, MonthlyStats } from '../../types';

export const remissionService = {
  async getByUserId(userId: number): Promise<Remission[]> {
    const { data } = await axios.get<Remission[]>(`/remissions/user/${userId}`);
    return data;
  },

  async getById(id: number): Promise<Remission> {
    const { data } = await axios.get<Remission>(`/remissions/${id}`);
    return data;
  },

  async create(remission: Omit<Remission, 'id' | 'totalKilos'>): Promise<Remission> {
    const { data } = await axios.post<Remission>('/remissions', remission);
    return data;
  },

  async update(id: number, remission: Partial<Remission>): Promise<Remission> {
    const { data } = await axios.put<Remission>(`/remissions/${id}`, remission);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/remissions/${id}`);
  },

  async getMonthlySummary(): Promise<MonthlyStats[]> {
    const { data } = await axios.get<MonthlyStats[]>('/remissions/monthly-summary');
    return data;
  }
};