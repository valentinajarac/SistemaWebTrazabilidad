export interface DashboardStats {
  totalProductores: number;
  totalFincas: number;
  totalCultivos: number;
  despachosMes: number;
  kilosUchuvaMes: number;
  kilosGulupaMes: number;
}

export interface MonthlyStats {
  mes: string;
  kilosUchuva: number;
  kilosGulupa: number;
}