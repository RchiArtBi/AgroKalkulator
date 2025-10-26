import React, { useCallback } from 'react';
import type { Machine } from '../types';

interface AdminPanelProps {
  machines: Machine[];
  loadMachines: (machines: Machine[]) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ machines, loadMachines, onLogout }) => {

  const parseCurrency = (value: any): number | null => {
    if (value === null || value === undefined) return null;
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
    
    // Convert to string to handle both numbers and strings, and replace comma with dot
    const stringValue = String(value).replace(',', '.');
    const num = parseFloat(stringValue);
    
    return isNaN(num) ? 0 : num;
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
    event.target.value = ''; // Reset input to allow re-uploading the same file
  }, [loadMachines]);
  
  const formatCurrencyPLN = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'Brak';
    return value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
  };

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

      {/* Sekcja importu pliku */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Import Danych z Pliku XLSX</h3>
        <p className="text-sm text-gray-600 mb-4">
          Wybierz plik .xlsx z danymi maszyn. Plik musi zawierać nagłówki: TYP, MODEL, WAGA (kg), STAWKA, itd.
          Istniejące dane zostaną nadpisane.
        </p>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                        <span>Załaduj plik</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".xlsx, .xls" onChange={handleFileImport} />
                    </label>
                    <p className="pl-1">lub przeciągnij i upuść</p>
                </div>
                <p className="text-xs text-gray-500">XLSX, XLS do 10MB</p>
            </div>
        </div>
      </div>


      {/* Tabela z maszynami */}
      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waga (kg)</th>
              <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stawka (zł/km)</th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Składanie</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {machines.length > 0 ? machines.map((machine) => (
              <tr key={machine.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{machine.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.model}</td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.weight.toLocaleString('pl-PL')}</td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{machine.rate.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrencyPLN(machine.assembly)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">Brak danych. Zaimportuj plik, aby wyświetlić maszyny.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;