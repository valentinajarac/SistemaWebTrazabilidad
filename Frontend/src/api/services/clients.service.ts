import axios from '../axios';
import { Client } from '../../types';

export const clientService = {
  async getAll(): Promise<Client[]> {
    const { data } = await axios.get<Client[]>('/clients');
    return data;
  },

  async getById(id: number): Promise<Client> {
    const { data } = await axios.get<Client>(`/clients/${id}`);
    return data;
  },

  async create(client: Omit<Client, 'id'>): Promise<Client> {
    const { data } = await axios.post<Client>('/clients', client);
    return data;
  },

  async update(id: number, client: Partial<Client>): Promise<Client> {
    const { data } = await axios.put<Client>(`/clients/${id}`, client);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axios.delete(`/clients/${id}`);
  }
};