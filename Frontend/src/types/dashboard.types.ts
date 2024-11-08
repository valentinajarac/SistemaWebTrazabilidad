export interface DashboardStats {
  totalProductores: number;
  productoresUchuva: number;
  productoresGulupa: number;
  totalFincas: number;
  totalCultivos: number;
  cultivosUchuva: number;
  cultivosGulupa: number;
  despachosMes: number;
  kilosUchuvaMes: number;
  kilosGulupaMes: number;
}

export interface MonthlyStats {
  mes: string;
  kilosUchuva: number;
  kilosGulupa: number;
}