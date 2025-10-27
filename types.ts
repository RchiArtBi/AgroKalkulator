export type Producer = 'CLAAS' | 'BOBCAT';

// Bazowy interfejs wspólny dla wszystkich maszyn
export interface BaseMachine {
  id: number;
  producer: Producer;
  type: string;
  model: string;
  name: string; // Połączenie typu i modelu dla wyświetlania
  weight: number; // w kilogramach
  rate: number; // w zł za kilometr
}

// Specyficzny interfejs dla maszyn Claas
export interface ClaasMachine extends BaseMachine {
  producer: 'CLAAS';
  review0: number | null;
  assembly: number | null;
  commissioning: number | null;
  review100: number | null;
  review500: number | null;
  review1000: number | null;
}

// Specyficzny interfejs dla maszyn Bobcat
export interface BobcatMachine extends BaseMachine {
  producer: 'BOBCAT';
  review0: number | null;
  assembly: number | null;
  review50: number | null;
  review100: number | null;
  review250: number | null;
  review500: number | null;
  review1000: number | null;
}

// Typ unii, który może reprezentować dowolny typ maszyny
export type AnyMachine = ClaasMachine | BobcatMachine;

export enum View {
  CALCULATOR,
  ADMIN_LOGIN,
  ADMIN_PANEL,
}
