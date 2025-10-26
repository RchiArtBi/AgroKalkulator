export interface Machine {
  id: number;
  type: string;
  model: string;
  name: string; // Połączenie typu i modelu dla wyświetlania
  weight: number; // w kilogramach
  rate: number; // w zł za kilometr
  review0: number | null;
  assembly: number | null;
  commissioning: number | null;
  review100: number | null;
  review500: number | null;
  review1000: number | null;
}

export enum View {
  CALCULATOR,
  ADMIN_LOGIN,
  ADMIN_PANEL,
}