import React, { useCallback, useState, useEffect } from 'react';
import type { AnyMachine, Producer, ClaasMachine, BobcatMachine } from '../types';
import { CLAAS_SERVICE_LABELS, BOBCAT_SERVICE_LABELS } from '../constants';

interface AdminPanelProps {
  machines: AnyMachine[];
  loadMachines: (machines: AnyMachine[]) => void;
  onLogout: () => void;
}

const claasServiceKeys = Object.keys(CLAAS_SERVICE_LABELS) as Array<keyof ClaasMachine>;
const bobcatServiceKeys = Object.keys(BOBCAT_SERVICE_LABELS) as Array<keyof BobcatMachine>;

const AdminPanel: React.FC<AdminPanelProps> = ({ machines, loadMachines, onLogout }) => {
  const [editableMachines, setEditableMachines] = useState<AnyMachine[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<Producer>('CLAAS');

  useEffect(() => {
    setEditableMachines(JSON.parse(JSON.stringify(machines)));
  }, [machines]);

  useEffect(() => {
    setIsDirty(JSON.stringify(machines) !== JSON.stringify(editableMachines));
  }, [machines, editableMachines]);

  const parseCurrency = (value: any): number | null => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return isNaN(value) ? null : value;
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

  const handleInputChange = (id: number, field: keyof AnyMachine, value: string) => {
    setEditableMachines(currentMachines => {
      return currentMachines.map(machine => {
        if (machine.id === id) {
          const updatedMachine = { ...machine };
          
          const isNumericField = ['weight', 'rate'].includes(field as string);
          const isCurrencyField = [...claasServiceKeys, ...bobcatServiceKeys].includes(field as any);

          if (isNumericField) {
            (updatedMachine as any)[field] = parseNumber(value);
          } else if (isCurrencyField) {
            (updatedMachine as any)[field] = parseCurrency(value);
          } else {
            (updatedMachine as any)[field] = value;
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
    const newMachine: AnyMachine = activeTab === 'CLAAS' ? {
      id: Date.now(),
      producer: 'CLAAS',
      type: 'NOWY TYP',
      model: 'NOWY MODEL',
      name: 'NOWY TYP NOWY MODEL',
      weight: 0, rate: 0, review0: null, assembly: null, commissioning: null, review100: null, review500: null, review1000: null,
    } : {
      id: Date.now(),
      producer: 'BOBCAT',
      type: 'NOWY TYP',
      model: 'NOWY MODEL',
      name: 'NOWY TYP NOWY MODEL',
      weight: 0, rate: 0, review0: null, assembly: null, review50: null, review100: null, review250: null, review500: null, review1000: null,
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


  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>, producer: Producer) => {
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

        const newMachines: AnyMachine[] = json.map((row, index) => {
          const type = String(row['TYP'] || 'Brak danych');
          const model = String(row['MODEL'] || 'Brak danych');
          
          if (producer === 'CLAAS') {
            return {
              id: Date.now() + index, producer: 'CLAAS', type, model, name: `${type} ${model}`.trim(),
              weight: parseNumber(row['WAGA (kg)']),
              rate: parseNumber(row['STAWKA']),
              review0: parseCurrency(row['PRZEGLĄD "0"']),
              assembly: parseCurrency(row['SKŁADANIE']),
              commissioning: parseCurrency(row['URUCHOMIENIE']),
              review100: parseCurrency(row['PRZEGLĄD PO 100 mtg']),
              review500: parseCurrency(row['PRZEGLĄD PO 500 mtg']),
              review1000: parseCurrency(row['PRZEGLĄD PO 1000 mtg']),
            } as ClaasMachine;
          } else { // BOBCAT
             return {
              id: Date.now() + index, producer: 'BOBCAT', type, model, name: `${type} ${model}`.trim(),
              weight: parseNumber(row['WAGA (kg)']),
              rate: parseNumber(row['STAWKA']),
              review0: parseCurrency(row['PRZEGLĄD "0"']),
              assembly: parseCurrency(row['SKŁADANIE']),
              review50: parseCurrency(row['PRZEGLĄD PO 50 mtg']),
              review100: parseCurrency(row['PRZEGLĄD PO 100 mtg']),
              review250: parseCurrency(row['PRZEGLĄD PO 250 mtg']),
              review500: parseCurrency(row['PRZEGLĄD PO 500 mtg']),
              review1000: parseCurrency(row['PRZEGLĄD PO 1000 mtg']),
            } as BobcatMachine;
          }
        });
        
        const otherProducerMachines = machines.filter(m => m.producer !== producer);
        loadMachines([...otherProducerMachines, ...newMachines]);
        alert(`Zaimportowano pomyślnie ${newMachines.length} maszyn dla ${producer}.`);
      } catch (error) {
        console.error("Błąd podczas importowania pliku:", error);
        alert("Wystąpił błąd podczas przetwarzania pliku. Upewnij się, że ma poprawny format i odpowiednie nazwy kolumn.");
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  }, [loadMachines, machines]);

  const machinesForDisplay = editableMachines.filter(m => m.producer === activeTab);
  const serviceKeys = activeTab === 'CLAAS' ? claasServiceKeys : bobcatServiceKeys;
  const serviceLabels = activeTab === 'CLAAS' ? CLAAS_SERVICE_LABELS : BOBCAT_SERVICE_LABELS;

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

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Import Danych CLAAS</h3>
          <p className="text-sm text-gray-600 mb-4">
            Wybierz plik .xlsx z danymi maszyn Claas. Istniejące dane Claas zostaną nadpisane.
          </p>
          <label htmlFor="file-upload-claas" className="relative cursor-pointer bg-gray-100 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 w-full inline-block text-center py-2 border border-dashed">
              <span>Wybierz plik Claas</span>
              <input id="file-upload-claas" type="file" className="sr-only" accept=".xlsx, .xls" onChange={(e) => handleFileImport(e, 'CLAAS')} />
          </label>
        </div>
         <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Import Danych BOBCAT</h3>
          <p className="text-sm text-gray-600 mb-4">
             Wybierz plik .xlsx z danymi maszyn Bobcat. Istniejące dane Bobcat zostaną nadpisane.
          </p>
          <label htmlFor="file-upload-bobcat" className="relative cursor-pointer bg-gray-100 rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500 w-full inline-block text-center py-2 border border-dashed">
              <span>Wybierz plik Bobcat</span>
              <input id="file-upload-bobcat" type="file" className="sr-only" accept=".xlsx, .xls" onChange={(e) => handleFileImport(e, 'BOBCAT')} />
          </label>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('CLAAS')}
                className={`${
                  activeTab === 'CLAAS'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                CLAAS
              </button>
              <button
                onClick={() => setActiveTab('BOBCAT')}
                className={`${
                  activeTab === 'BOBCAT'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                BOBCAT
              </button>
            </nav>
        </div>
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-700">Edytor Danych: {activeTab}</h3>
          <div className="flex items-center space-x-2">
             <button
              onClick={handleAddRow}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 text-sm"
            >
              + Dodaj maszynę ({activeTab})
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
                  <th key={key as string} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">{serviceLabels[key as keyof typeof serviceLabels]}</th>
                ))}
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {machinesForDisplay.length > 0 ? machinesForDisplay.map((machine) => (
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
                     <td key={key as string} className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                       <input type="text" placeholder="Brak" value={(machine as any)[key] ?? ''} onChange={(e) => handleInputChange(machine.id, key as any, e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
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
                  <td colSpan={serviceKeys.length + 5} className="text-center py-10 text-gray-500">Brak danych dla producenta {activeTab}. Zaimportuj plik lub dodaj maszynę ręcznie.</td>
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
