import type { ClaasMachine, BobcatMachine, AnyMachine } from './types';

export const INITIAL_CLAAS_MACHINES: ClaasMachine[] = [
  {
    id: 1, producer: 'CLAAS', type: 'CIĄGNIK', model: 'Arion 400', name: 'CIĄGNIK Arion 400',
    weight: 4800, rate: 4.80, review0: 1280.00, assembly: null, commissioning: 256.00, review100: 3293.53, review500: 3477.12, review1000: 7494.62,
  },
  {
    id: 2, producer: 'CLAAS', type: 'CIĄGNIK', model: 'Arion 600', name: 'CIĄGNIK Arion 600',
    weight: 5800, rate: 5.60, review0: 1280.00, assembly: null, commissioning: 256.00, review100: 4155.68, review500: 5365.00, review1000: 6987.58,
  },
  {
    id: 3, producer: 'CLAAS', type: 'CIĄGNIK', model: 'Axion 800', name: 'CIĄGNIK Axion 800',
    weight: 8900, rate: 6.80, review0: 1280.00, assembly: null, commissioning: 256.00, review100: 4155.68, review500: 5365.00, review1000: 6987.58,
  },
  {
    id: 4, producer: 'CLAAS', type: 'CIĄGNIK', model: 'Axion 900', name: 'CIĄGNIK Axion 900',
    weight: 14500, rate: 6.80, review0: 1280.00, assembly: null, commissioning: 256.00, review100: 5550.00, review500: 11700.00, review1000: 8850.00,
  },
  {
    id: 5, producer: 'CLAAS', type: 'CIĄGNIK', model: 'Xerion', name: 'CIĄGNIK Xerion',
    weight: 18000, rate: 8.00, review0: 1280.00, assembly: null, commissioning: 256.00, review100: 2800.00, review500: 8200.00, review1000: 16300.00,
  },
  {
    id: 6, producer: 'CLAAS', type: 'KOMBAJN', model: 'Evion', name: 'KOMBAJN Evion',
    weight: 12500, rate: 8.00, review0: 4100.00, assembly: null, commissioning: 1280.00, review100: 2053.83, review500: 5707.15, review1000: 10828.21,
  },
  {
    id: 7, producer: 'CLAAS', type: 'KOMBAJN', model: 'Trion', name: 'KOMBAJN Trion',
    weight: 18000, rate: 8.00, review0: 4100.00, assembly: null, commissioning: 1280.00, review100: 2917.83, review500: 7373.61, review1000: 11822.65,
  },
  {
    id: 8, producer: 'CLAAS', type: 'KOMBAJN', model: 'Lexion', name: 'KOMBAJN Lexion',
    weight: 22300, rate: 8.00, review0: 4100.00, assembly: null, commissioning: 1280.00, review100: 2773.83, review500: 13772.46, review1000: 16218.14,
  },
  {
    id: 9, producer: 'CLAAS', type: 'SIECZKARNIA', model: 'Jaguar 800/900', name: 'SIECZKARNIA Jaguar 800/900',
    weight: 17000, rate: 8.00, review0: 4100.00, assembly: null, commissioning: 1280.00, review100: 2917.83, review500: 7373.61, review1000: 11822.65,
  },
  {
    id: 10, producer: 'CLAAS', type: 'KOSIARKA', model: 'Kosiarki czołowe', name: 'KOSIARKA Kosiarki czołowe',
    weight: 1300, rate: 4.80, review0: null, assembly: 1000.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 11, producer: 'CLAAS', type: 'KOSIARKA', model: 'Kosiarki czołowe z kondycjonerem', name: 'KOSIARKA Kosiarki czołowe z kondycjonerem',
    weight: 1600, rate: 4.80, review0: null, assembly: 1400.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 12, producer: 'CLAAS', type: 'KOSIARKA', model: 'Kosiarki tylne', name: 'KOSIARKA Kosiarki tylne',
    weight: 1000, rate: 4.80, review0: null, assembly: 1200.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 13, producer: 'CLAAS', type: 'KOSIARKA', model: 'Kosiarki tylne z kondycjonerem', name: 'KOSIARKA Kosiarki tylne z kondycjonerem',
    weight: 1200, rate: 4.80, review0: null, assembly: 1600.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 14, producer: 'CLAAS', type: 'KOSIARKA', model: 'Zestaw kosiarek', name: 'KOSIARKA Zestaw kosiarek',
    weight: 4500, rate: 6.80, review0: null, assembly: 3600.00, commissioning: 512.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 15, producer: 'CLAAS', type: 'ZGRABIARKA', model: 'Jednokaruzelowe', name: 'ZGRABIARKA Jednokaruzelowe',
    weight: 1400, rate: 6.80, review0: null, assembly: 1000.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 16, producer: 'CLAAS', type: 'ZGRABIARKA', model: 'Dwukaruzelowe', name: 'ZGRABIARKA Dwukaruzelowe',
    weight: 2900, rate: 6.80, review0: null, assembly: 1800.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 17, producer: 'CLAAS', type: 'ZGRABIARKA', model: 'Czterokaruzelowe', name: 'ZGRABIARKA Czterokaruzelowe',
    weight: 6400, rate: 6.80, review0: null, assembly: 3330.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 18, producer: 'CLAAS', type: 'PRZETRZĄSACZ', model: 'Do 7 m.', name: 'PRZETRZĄSACZ Do 7 m.',
    weight: 800, rate: 6.80, review0: null, assembly: 1660.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 19, producer: 'CLAAS', type: 'PRZETRZĄSACZ', model: 'Powyżej 7 m.', name: 'PRZETRZĄSACZ Powyżej 7 m.',
    weight: 1100, rate: 6.80, review0: null, assembly: 2300.00, commissioning: 256.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 20, producer: 'CLAAS', type: 'USŁUGI', model: 'Montaż ładowacza', name: 'USŁUGI Montaż ładowacza',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 7680.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 21, producer: 'CLAAS', type: 'USŁUGI', model: 'Montaż TUZ', name: 'USŁUGI Montaż TUZ',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 4480.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 22, producer: 'CLAAS', type: 'USŁUGI', model: 'Montaż WOM', name: 'USŁUGI Montaż WOM',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 4489.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 23, producer: 'CLAAS', type: 'USŁUGI', model: 'Montaż kamer', name: 'USŁUGI Montaż kamer',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 1024.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 24, producer: 'CLAAS', type: 'USŁUGI', model: 'CEMIS - konfiguracja', name: 'USŁUGI CEMIS - konfiguracja',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 1024.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 25, producer: 'CLAAS', type: 'USŁUGI', model: 'Gąsiennice', name: 'USŁUGI Gąsiennice',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 512.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 26, producer: 'CLAAS', type: 'MASZYNY UŻYWANE', model: 'Weryfikacja ciągnika', name: 'MASZYNY UŻYWANE Weryfikacja ciągnika',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 1536.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 27, producer: 'CLAAS', type: 'MASZYNY UŻYWANE', model: 'Przegląd mały', name: 'MASZYNY UŻYWANE Przegląd mały',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 1024.00, review100: null, review500: null, review1000: null,
  },
  {
    id: 28, producer: 'CLAAS', type: 'MASZYNY UŻYWANE', model: 'Przegląd duży', name: 'MASZYNY UŻYWANE Przegląd duży',
    weight: 0, rate: 0, review0: null, assembly: null, commissioning: 2048.00, review100: null, review500: null, review1000: null,
  },
];

export const INITIAL_BOBCAT_MACHINES: BobcatMachine[] = [
  {
    id: 101, producer: 'BOBCAT', type: 'ŁADOWARKA', model: 'Wszystkie modele', name: 'ŁADOWARKA Wszystkie modele',
    weight: 8200, rate: 6.80, review0: 750.00, assembly: null, review50: null, review100: 2810.00, review250: null, review500: 3780.00, review1000: 6620.00
  },
  {
    id: 102, producer: 'BOBCAT', type: 'MINIKOPARKA', model: 'E19', name: 'MINIKOPARKA E19',
    weight: 1800, rate: 6.80, review0: 500.00, assembly: null, review50: null, review100: 1190.00, review250: null, review500: 1890.00, review1000: 3030.00
  },
  {
    id: 103, producer: 'BOBCAT', type: 'MINIKOPARKA', model: 'E27', name: 'MINIKOPARKA E27',
    weight: 2700, rate: 6.80, review0: 500.00, assembly: null, review50: 1390.00, review100: null, review250: 1290.00, review500: 1690.00, review1000: 2830.00
  }
];

export const INITIAL_MACHINES: AnyMachine[] = [...INITIAL_CLAAS_MACHINES, ...INITIAL_BOBCAT_MACHINES];

export const CLAAS_SERVICE_LABELS = {
  review0: 'Przegląd "0"',
  assembly: 'Składanie',
  commissioning: 'Uruchomienie',
  review100: 'Przegląd po 100 mtg',
  review500: 'Przegląd po 500 mtg',
  review1000: 'Przegląd po 1000 mtg',
};

export const BOBCAT_SERVICE_LABELS = {
  review0: 'Przegląd "0"',
  assembly: 'Składanie',
  review50: 'Przegląd po 50 mtg',
  review100: 'Przegląd po 100 mtg',
  review250: 'Przegląd po 250 mtg',
  review500: 'Przegląd po 500 mtg',
  review1000: 'Przegląd po 1000 mtg',
};