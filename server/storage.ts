import type { Irregularity, ChartData } from "@shared/schema";

export interface IStorage {
  getIrregularities(): Promise<Irregularity[]>;
  saveIrregularities(data: Irregularity[]): Promise<void>;
  getChartData(): Promise<ChartData[]>;
  saveChartData(data: ChartData[]): Promise<void>;
}

class MemStorage implements IStorage {
  private irregularities: Irregularity[] = [];
  private chartData: ChartData[] = [];

  async getIrregularities(): Promise<Irregularity[]> {
    return this.irregularities;
  }

  async saveIrregularities(data: Irregularity[]): Promise<void> {
    this.irregularities = data;
  }

  async getChartData(): Promise<ChartData[]> {
    return this.chartData;
  }

  async saveChartData(data: ChartData[]): Promise<void> {
    this.chartData = data;
  }
}

export const storage: IStorage = new MemStorage();
