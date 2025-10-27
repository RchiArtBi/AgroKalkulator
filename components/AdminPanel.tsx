import React, { useCallback, useState, useEffect } from 'react';
import type { Machine } from '../types';
import { SERVICE_LABELS } from '../constants';

interface AdminPanelProps {
  machines: Machine[];
  loadMachines: (machines: Machine[]) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ machines, loadMachines, onLogout }) => {
  const [editableMachines, setEditableMachines] = useState<Machine[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Deep copy to prevent direct mutation of props and allow for resetting changes
    setEditableMachines(JSON.parse(JSON.stringify(machines)));
  }, [machines]);

  useEffect(() => {
    // Check if there are any unsaved changes
    setIsDirty(JSON.stringify(machines) !== JSON.stringify(editableMachines));
  }, [machines, editableMachines]);

  const parseCurrency = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') {
        return isNaN(value) ? null : value;
    }
    if (typeof value !== 'string') return null;

    const cleaned = value.replace(/zł/g, '').replace(/\s/g, '').replace(',', '.').trim();
    if (cleaned === '-' || cleaned === '') return null;
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const parseNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    
    const stringValue = String(value).replace(',', '.');
    const num = parseFloat(stringValue);
    
    return isNaN(num) ? 0 : num;
  };

  const handleInputChange = (id: number, field: keyof Machine, value: string) => {
    setEditableMachines(currentMachines => {
      return currentMachines.map(machine => {
        if (machine.id === id) {
          const updatedMachine = { ...machine };
          
          if (field === 'weight' || field === 'rate') {
            (updatedMachine[field] as number) = parseNumber(value);
          } else if (['review0', 'assembly', 'commissioning', 'review100', 'review500', 'review1000'].includes(field)) {
            (updatedMachine[field] as number | null) = parseCurrency(value);
          } else {
            (updatedMachine[field] as string) = value;
          }

          if (field === 'type' || field === 'model') {
            updatedMachine.name = `${updatedMachine.type} ${updatedMachine.model}`.trim();
          }
          return updatedMachine;
        }
        return machine;
      });
    });
  };

  const handleAddRow = () => {
    const newMachine: Machine = {
      id: Date.now(),
      type: 'NOWY TYP',
      model: 'NOWY MODEL',
      name: 'NOWY TYP NOWY MODEL',
      weight: 0,
      rate: 0,
      review0: null,
      assembly: null,
      commissioning: null,
      review100: null,
      review500: null,
      review1000: null,
    };
    setEditableMachines(prev => [...prev, newMachine]);
  };

  const handleDeleteRow = (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę maszynę?')) {
      setEditableMachines(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveChanges = () => {
    loadMachines(editableMachines);
    alert('Zmiany zostały pomyślnie zapisane.');
  };

  const handleResetChanges = () => {
    setEditableMachines(JSON.parse(JSON.stringify(machines)));
  };


  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = (window as any).XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = (window as any).XLSX.utils.sheet_to_json(worksheet);

        const newMachines: Machine[] = json.map((row, index) => {
          const type = String(row['TYP'] || 'Brak danych');
          const model = String(row['MODEL'] || 'Brak danych');
          
          return {
            id: Date.now() + index,
            type: type,
            model: model,
            name: `${type} ${model}`.trim(),
            weight: parseNumber(row['WAGA (kg)']),
            rate: parseNumber(row['STAWKA']),
            review0: parseCurrency(row['PRZEGLĄD "0"']),
            assembly: parseCurrency(row['SKŁADANIE']),
            commissioning: parseCurrency(row['URUCHOMIENIE']),
            review100: parseCurrency(row['PRZEGLĄD PO 100 mtg']),
            review500: parseCurrency(row['PRZEGLĄD PO 500 mtg']),
            review1000: parseCurrency(row['PRZEGLĄD PO 1000 mtg']),
          };
        });
        
        loadMachines(newMachines);
        alert(`Zaimportowano pomyślnie ${newMachines.length} maszyn.`);
      } catch (error) {
        console.error("Błąd podczas importowania pliku:", error);
        alert("Wystąpił błąd podczas przetwarzania pliku. Upewnij się, że ma poprawny format.");
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  }, [loadMachines]);

  const serviceKeys = Object.keys(SERVICE_LABELS) as Array<keyof typeof SERVICE_LABELS>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Zarządzanie Maszynami</h2>
        <button 
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
        >
          Wyloguj
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Import Danych z Pliku XLSX</h3>
        <p className="text-sm text-gray-600 mb-4">
          Wybierz plik .xlsx z danymi maszyn. Istniejące dane zostaną nadpisane.
        </p>
        <div className="mt-1">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-100 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 w-full inline-block text-center py-2 border border-dashed">
                <span>Wybierz plik do importu</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .xls" onChange={handleFileImport} />
            </label>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-700">Edytor Danych</h3>
          <div className="flex items-center space-x-2">
             <button
              onClick={handleAddRow}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm"
            >
              + Dodaj maszynę
            </button>
            <button
              onClick={handleResetChanges}
              disabled={!isDirty}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              Resetuj
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={!isDirty}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[150px]">Typ</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Model</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Waga (kg)</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Stawka (zł)</th>
                {serviceKeys.map(key => (
                  <th key={key} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">{SERVICE_LABELS[key]}</th>
                ))}
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editableMachines.length > 0 ? editableMachines.map((machine) => (
                <tr key={machine.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50">
                    <input type="text" value={machine.type} onChange={(e) => handleInputChange(machine.id, 'type', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input type="text" value={machine.model} onChange={(e) => handleInputChange(machine.id, 'model', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input type="number" value={machine.weight} onChange={(e) => handleInputChange(machine.id, 'weight', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input type="number" step="0.01" value={machine.rate} onChange={(e) => handleInputChange(machine.id, 'rate', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                  </td>
                  {serviceKeys.map(key => (
                     <td key={key} className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                       <input type="text" placeholder="Brak" value={machine[key] ?? ''} onChange={(e) => handleInputChange(machine.id, key, e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                     </td>
                  ))}
                  <td className="px-2 py-2 whitespace-nowrap text-sm text-center font-medium sticky right-0 bg-white hover:bg-gray-50">
                    <button onClick={() => handleDeleteRow(machine.id)} className="text-red-600 hover:text-red-900" aria-label="Usuń maszynę">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                       </svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={serviceKeys.length + 5} className="text-center py-10 text-gray-500">Brak danych. Zaimportuj plik lub dodaj maszynę ręcznie.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
