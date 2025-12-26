import React, { useState, useMemo, useEffect } from 'react';
import type { AnyMachine, Producer, ClaasMachine, BobcatMachine } from '../types';
import { CLAAS_SERVICE_LABELS, BOBCAT_SERVICE_LABELS } from '../constants';

interface CalculatorProps {
  machines: AnyMachine[];
}

type ServiceKey = keyof typeof CLAAS_SERVICE_LABELS | keyof typeof BOBCAT_SERVICE_LABELS;

interface MachineEntry {
  id: number;
  type: string;
  machineId: string;
}

const Calculator: React.FC<CalculatorProps> = ({ machines }) => {
  const [selectedProducer, setSelectedProducer] = useState<Producer | null>(null);
  
  const [machineEntries, setMachineEntries] = useState<MachineEntry[]>([
    { id: Date.now(), type: '', machineId: '' }
  ]);
  const [distance, setDistance] = useState<string>('');
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  
  const [transportCost, setTransportCost] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const machineTypes = useMemo(() => {
    if (!selectedProducer) return [];
    return [...new Set(machines.filter(m => m.producer === selectedProducer).map(m => m.type))];
  }, [machines, selectedProducer]);
  
  const currencyFormatter = useMemo(() => new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), []);

  const numberFormatter = useMemo(() => new Intl.NumberFormat('pl-PL'), []);
  
  const rateFormatter = useMemo(() => new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), []);
  
  const selectedMachines = useMemo(() => {
    return machineEntries
      .map(entry => machines.find(m => m.id === parseInt(entry.machineId, 10)))
      .filter((m): m is AnyMachine => !!m);
  }, [machineEntries, machines]);

  const machineForTransport = useMemo(() => {
    const transportableMachines = selectedMachines.filter(m => m.type !== 'USŁUGI');
    if (transportableMachines.length === 0) return null;
    if (transportableMachines.length === 1) return transportableMachines[0];
    return transportableMachines.reduce((prev, current) => (prev.rate > current.rate ? prev : current));
  }, [selectedMachines]);

  const isAnyServiceSelected = useMemo(() => selectedMachines.some(m => m.type === 'USŁUGI'), [selectedMachines]);
  const isAnyTransportableMachineSelected = useMemo(() => selectedMachines.some(m => m.type !== 'USŁUGI'), [selectedMachines]);
  
  const resetCalculatorState = () => {
      setMachineEntries([{ id: Date.now(), type: '', machineId: '' }]);
      setDistance('');
      setDistanceError(null);
      setSelectedServices({});
      setTransportCost(null);
      setAdditionalCost(null);
      setTotalCost(null);
  }

  const handleProducerSelect = (producer: Producer) => {
    resetCalculatorState();
    setSelectedProducer(producer);
  };
  
  const handleBackToProducerSelection = () => {
    setSelectedProducer(null);
    resetCalculatorState();
  };

  useEffect(() => {
      const initialServices: Record<string, boolean> = {};
      selectedMachines.forEach(machine => {
          const isService = machine.type === 'USŁUGI';
          const serviceLabels = machine.producer === 'CLAAS' ? CLAAS_SERVICE_LABELS : BOBCAT_SERVICE_LABELS;

          (Object.keys(serviceLabels) as ServiceKey[]).forEach(key => {
              if ((machine as any)[key] !== null) {
                let isMandatory = false;
                if(machine.producer === 'CLAAS'){
                    isMandatory = !isService && (key === 'review0' || key === 'assembly' || key === 'commissioning');
                } else {
                    isMandatory = !isService && (key === 'review0');
                }
                const isMandatoryService = isService && key === 'commissioning' && machine.producer === 'CLAAS';
                
                initialServices[`${machine.id}-${key}`] = isMandatory || isMandatoryService;
              }
          });
      });
      setSelectedServices(initialServices);
      
      setTransportCost(null);
      setAdditionalCost(null);
      setTotalCost(null);
  }, [selectedMachines]);

  const handleAddMachine = () => {
    setMachineEntries(prev => [...prev, { id: Date.now(), type: '', machineId: '' }]);
  };

  const handleRemoveMachine = (idToRemove: number) => {
    if (machineEntries.length > 1) {
        setMachineEntries(prev => prev.filter(entry => entry.id !== idToRemove));
    }
  };
  
  const handleServiceChange = (machineId: number, serviceKey: ServiceKey) => {
    const key = `${machineId}-${serviceKey}`;
    setSelectedServices(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const MachineSelector: React.FC<{
    entry: MachineEntry;
    index: number;
    canBeRemoved: boolean;
    onRemove: () => void;
  }> = ({ entry, index, canBeRemoved, onRemove }) => {
    
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setMachineEntries(prev => prev.map(item => 
            item.id === entry.id ? { ...item, type: newType, machineId: '' } : item
        ));
    };

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setMachineEntries(prev => prev.map(item =>
            item.id === entry.id ? { ...item, machineId: newId } : item
        ));
    };

    return (
      <div className="space-y-4 border border-gray-200 p-4 rounded-lg relative">
        {canBeRemoved && (
            <button onClick={onRemove} className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors" aria-label="Usuń maszynę">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`machine-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Typ maszyny
            </label>
            <select 
              id={`machine-type-${index}`}
              value={entry.type}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Wybierz typ --</option>
              {machineTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`machine-model-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              { entry.type === 'USŁUGI' ? `Usługa` : `Model maszyny` }
            </label>
            <select 
              id={`machine-model-${index}`}
              value={entry.machineId}
              onChange={handleModelChange}
              disabled={!entry.type}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            >
              <option value="">-- Wybierz { entry.type === 'USŁUGI' ? 'usługę' : 'model' } --</option>
              {machines.filter(m => m.type === entry.type && m.producer === selectedProducer).map(machine => (
                <option key={machine.id} value={machine.id}>{machine.model}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  const handleCalculate = () => {
    setTotalCost(null);
    if (selectedMachines.length === 0) {
      alert('Proszę wybrać maszynę lub usługę.');
      return;
    }

    // Usunięto wymóg podania dystansu - jeśli jest pusty, przyjmujemy 0
    const distanceValue = distance === '' ? 0 : parseFloat(distance);
    
    if (distance !== '' && (isNaN(distanceValue) || distanceValue < 0)) {
      setDistanceError('Odległość musi być liczbą dodatnią.');
      return;
    }
    setDistanceError(null);

    const calculatedTransportCost = isAnyTransportableMachineSelected && machineForTransport 
      ? machineForTransport.rate * distanceValue 
      : 0;
    setTransportCost(calculatedTransportCost);

    let calculatedAdditionalCost = 0;
    for (const key in selectedServices) {
        if(selectedServices[key]) {
            const [machineIdStr, serviceKey] = key.split('-');
            const machineId = parseInt(machineIdStr);
            const machine = machines.find(m => m.id === machineId);
            if (machine && (machine as any)[serviceKey as ServiceKey] !== null) {
                calculatedAdditionalCost += (machine as any)[serviceKey as ServiceKey] as number;
            }
        }
    }
    setAdditionalCost(calculatedAdditionalCost);
    setTotalCost(calculatedTransportCost + calculatedAdditionalCost);
  };
  
  if (!selectedProducer) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">Wybierz producenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleProducerSelect('CLAAS')} className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:shadow-lg transition-all duration-300">
               <span className="text-2xl font-bold text-gray-700">CLAAS</span>
            </button>
            <button onClick={() => handleProducerSelect('BOBCAT')} className="flex flex-col items-center justify-center p-8 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:shadow-lg transition-all duration-300">
              <span className="text-2xl font-bold text-gray-700">BOBCAT</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {isAnyServiceSelected && !isAnyTransportableMachineSelected ? 'Oblicz koszt usługi' : 'OBLICZ KOSZTY'}
            </h2>
            <button onClick={handleBackToProducerSelection} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
              Zmień producenta
            </button>
        </div>

        
        <div className="space-y-4">
          {machineEntries.map((entry, index) => (
            <MachineSelector
              key={entry.id}
              entry={entry}
              index={index}
              canBeRemoved={machineEntries.length > 1}
              onRemove={() => handleRemoveMachine(entry.id)}
            />
          ))}
        </div>

        <div className="flex justify-center pt-2">
            <button 
              onClick={handleAddMachine}
              className="text-sm text-green-600 hover:text-green-800 font-semibold transition-colors border-2 border-dashed border-gray-300 rounded-md px-4 py-2 hover:border-green-400"
            >
              + Dodaj kolejną maszynę
            </button>
        </div>
        
        {machineForTransport && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="font-semibold mb-1">Dane do obliczenia transportu (wybrano maszynę z wyższą stawką):</p>
            <p><span className="font-semibold">Model:</span> {machineForTransport.name}</p>
            <p><span className="font-semibold">Waga:</span> {numberFormatter.format(machineForTransport.weight)} kg</p>
            <p><span className="font-semibold">Stawka transportu:</span> {rateFormatter.format(machineForTransport.rate)} zł/km</p>
          </div>
        )}
        
        {isAnyTransportableMachineSelected && (
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">PODAJ LICZBĘ KILOMETRÓW W OBIE STRONY</label>
            <input 
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => { setDistance(e.target.value); if (distanceError) setDistanceError(null); }}
              placeholder="np. 200 (pozostaw puste dla 0 km)"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                distanceError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
              }`}
              aria-invalid={!!distanceError}
              aria-describedby={distanceError ? 'distance-error' : undefined}
            />
            {distanceError && <p id="distance-error" className="mt-1 text-sm text-red-600" role="alert">{distanceError}</p>}
          </div>
        )}
        
        {selectedMachines.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-700">
              {isAnyTransportableMachineSelected ? 'Koszty dodatkowe i usługi:' : 'Koszty usług:'}
            </h3>
            {selectedMachines.map(machine => {
              const serviceLabels = machine.producer === 'CLAAS' ? CLAAS_SERVICE_LABELS : BOBCAT_SERVICE_LABELS;
              return (
              <div key={machine.id}>
                <h4 className="font-semibold text-md text-gray-600 mb-2">{machine.name}</h4>
                {Object.entries(serviceLabels).map(([key, label]) => {
                  const serviceKey = key as ServiceKey;
                  const cost = (machine as any)[serviceKey];
                  if (cost === null || cost === undefined) return null;
                  
                  const isService = machine.type === 'USŁUGI';

                  let isMandatory = false;
                  if (machine.producer === 'CLAAS') {
                      isMandatory = !isService && (serviceKey === 'review0' || serviceKey === 'commissioning' || serviceKey === 'assembly');
                  } else {
                      isMandatory = !isService && serviceKey === 'review0';
                  }
                  const isMandatoryService = isService && serviceKey === 'commissioning' && machine.producer === 'CLAAS';


                  return (
                    <div key={serviceKey} className="flex items-center justify-between bg-gray-50 p-2 rounded-md mb-2">
                      <label htmlFor={`${machine.id}-${serviceKey}`} className={`flex items-center space-x-2 text-sm text-gray-800 ${(isMandatory || isMandatoryService) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          id={`${machine.id}-${serviceKey}`}
                          checked={selectedServices[`${machine.id}-${serviceKey}`] || false}
                          onChange={() => handleServiceChange(machine.id, serviceKey)}
                          disabled={isMandatory || isMandatoryService}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 disabled:opacity-75"
                        />
                        <span>{isService && serviceKey === 'commissioning' ? machine.model : label}</span>
                      </label>
                      <span className="text-sm font-medium text-gray-900">
                        {currencyFormatter.format(cost)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )})}
          </div>
        )}

        <button 
          onClick={handleCalculate}
          disabled={!selectedMachines.length}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Oblicz
        </button>

        {totalCost !== null && (
          <div className="mt-6 space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-bold text-green-800 text-center border-b pb-2">Podsumowanie kosztów</h3>
            {isAnyTransportableMachineSelected && (
              <div className="flex justify-between items-center">
                <span className="text-md text-gray-600">Koszt transportu:</span>
                <span className="text-lg font-semibold text-gray-800">
                  {transportCost !== null && currencyFormatter.format(transportCost)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-md text-gray-600">
                {
                  isAnyTransportableMachineSelected 
                    ? (isAnyServiceSelected ? 'Suma kosztów dodatkowych i usług:' : 'Suma kosztów dodatkowych:') 
                    : 'Całkowity koszt usług:'
                }
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {additionalCost !== null && currencyFormatter.format(additionalCost)}
              </span>
            </div>
            <div className="flex justify-between items-center text-green-700 bg-green-100 p-3 rounded-md mt-2">
              <span className="text-xl font-bold">
                 {isAnyTransportableMachineSelected ? 'Całkowity koszt końcowy:' : 'Całkowity koszt usługi:'}
              </span>
              <span className="text-2xl font-extrabold">
                {currencyFormatter.format(totalCost)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;