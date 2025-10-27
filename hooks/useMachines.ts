import { useState, useEffect, useCallback } from 'react';
import type { AnyMachine } from '../types';
import { INITIAL_MACHINES } from '../constants';

const STORAGE_KEY = 'agro-kalkulator-machines';
const VERSION_KEY = 'agro-kalkulator-data-version';
const CURRENT_DATA_VERSION = '1.4'; // Wersja danych, zwiększona przy aktualizacji INITIAL_MACHINES

// Funkcja do wczytywania maszyn z localStorage przy starcie
const loadInitialMachines = (): AnyMachine[] => {
  try {
    const storedVersion = window.localStorage.getItem(VERSION_KEY);

    // Sprawdza, czy zapisana wersja danych w przeglądarce jest aktualna.
    // Jeśli nie, oznacza to, że domyślna lista maszyn w aplikacji została zaktualizowana.
    if (storedVersion !== CURRENT_DATA_VERSION) {
      // Wymusza odświeżenie danych: usuwa starą listę i ładuje nową, domyślną.
      // Zapobiega to wyświetlaniu nieaktualnych danych zapisanych w pamięci podręcznej przeglądarki.
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(VERSION_KEY, CURRENT_DATA_VERSION);
      return INITIAL_MACHINES;
    }
    
    // Jeśli wersja jest aktualna, próbuje wczytać maszyny z pamięci.
    const storedMachines = window.localStorage.getItem(STORAGE_KEY);
    if (storedMachines) {
      return JSON.parse(storedMachines);
    }
  } catch (error) {
    console.error("Błąd podczas wczytywania maszyn z localStorage:", error);
  }
  
  // Jeśli localStorage jest pusty (pierwsze uruchomienie) lub wystąpił błąd,
  // ładuje domyślną listę i zapisuje numer wersji.
  window.localStorage.setItem(VERSION_KEY, CURRENT_DATA_VERSION);
  return INITIAL_MACHINES;
};


export const useMachines = () => {
  const [machines, setMachines] = useState<AnyMachine[]>(loadInitialMachines);

  // Efekt do synchronizacji stanu z localStorage, gdy stan się zmienia
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
    } catch (error) {
      console.error("Błąd podczas zapisywania maszyn w localStorage:", error);
    }
  }, [machines]);


  const loadMachines = useCallback((newMachines: AnyMachine[]) => {
    setMachines(newMachines);
  }, []);

  return { machines, loadMachines };
};
