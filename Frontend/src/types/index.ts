// Enums
export enum Role {
  ADMIN = 'ADMIN',
  PRODUCER = 'PRODUCER'
}

export enum ProductType {
  UCHUVA = 'UCHUVA',
  GULUPA = 'GULUPA'
}

export enum CropStatus {
  PRODUCCION = 'PRODUCCION',
  VEGETACION = 'VEGETACION'
}

// Interfaces principales
export interface User {
  id: number;
  cedula: string;
  nombreCompleto: string;
  codigoTrazabilidad: string;
  municipio: string;
  telefono: string;
  usuario: string;
  password?: string;
  role: Role;
}

export interface Farm {
  id: number;
  nombre: string;
  hectareas: number;
  municipio: string;
  userId: number;
}

export interface Crop {
  id: number;
  numeroPlants: number;
  hectareas: number;
  producto: ProductType;
  estado: CropStatus;
  farmId: number;
  userId: number;
}

export interface Client {
  id: number;
  nit: string;
  nombre: string;
  floid: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface Remission {
  id: number;
  fechaDespacho: string;
  canastillasEnviadas: number;
  kilosPromedio: number;
  totalKilos: number;
  producto: ProductType;
  userId: number;
  farmId: number;
  cropId: number;
  clientId: number;
}

// Interfaces para respuestas de la API
export interface AuthResponse {
  token: string;
  role: Role;
  userId: number;
  username: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Interfaces para estadísticas
export interface MonthlyStats {
  mes: string;
  kilosUchuva: number;
  kilosGulupa: number;
}

// Interfaces para formularios
export interface LoginForm {
  username: string;
  password: string;
}

export interface UserForm extends Omit<User, 'id'> {}
export interface FarmForm extends Omit<Farm, 'id' | 'userId'> {}
export interface CropForm extends Omit<Crop, 'id' | 'userId'> {}
export interface ClientForm extends Omit<Client, 'id'> {}
export interface RemissionForm extends Omit<Remission, 'id' | 'userId' | 'totalKilos'> {}