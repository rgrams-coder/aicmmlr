import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Mineral } from '../types';

interface CalculatorInputs {
  mineral: string;
  quality: string;
  royaltyRate: number;
  quantity: number;
  area: number;
}

interface CalculationResults {
  royalty: number;
  deadRent: number;
  dmft: number;
  interest: number;
  nmet: number;
  itCess: number;
  managementFee: number;
  environmentCess: number;
  totalDemand: number;
}

const MiningCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    mineral: '',
    quality: '',
    royaltyRate: 0,
    quantity: 0,
    area: 0,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [selectedMineral, setSelectedMineral] = useState<Mineral | null>(null);
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);

  useEffect(() => {
    const fetchMinerals = async () => {
      try {
        const response = await apiService.getMinerals();
        console.log('Minerals response:', response);
        setMinerals(response.minerals || []);
      } catch (error) {
        console.error('Failed to fetch minerals:', error);
        setMinerals([]);
      }
    };
    fetchMinerals();
  }, []);

  useEffect(() => {
    if (inputs.mineral) {
      const qualities = minerals
        .filter(m => m.name === inputs.mineral)
        .map(m => m.quality);
      setAvailableQualities(qualities);
      setInputs(prev => ({ ...prev, quality: '' }));
    } else {
      setAvailableQualities([]);
    }
  }, [inputs.mineral, minerals]);

  useEffect(() => {
    if (inputs.mineral && inputs.quality) {
      const mineral = minerals.find(m => 
        m.name === inputs.mineral && m.quality === inputs.quality
      );
      setSelectedMineral(mineral || null);
      if (mineral) {
        setInputs(prev => ({ ...prev, royaltyRate: mineral.royaltyRate }));
      }
    } else {
      setSelectedMineral(null);
      setInputs(prev => ({ ...prev, royaltyRate: 0 }));
    }
  }, [inputs.mineral, inputs.quality, minerals]);

  const uniqueMineralNames = [...new Set(minerals.map(m => m.name))];

  const calculateDemand = () => {
    if (!inputs.royaltyRate) {
      alert('Please select mineral and quality to get royalty rate');
      return;
    }

    const royalty = inputs.royaltyRate * inputs.quantity;
    const deadRent = (inputs.area * 30000) / 4; // Quarterly calculation
    const dmft = royalty * 0.30;
    const interest = royalty * 0.24 / 12; // Monthly interest
    const nmet = royalty * 0.02;
    const itCess = royalty * 0.02;
    const managementFee = inputs.quantity * 1;
    const environmentCess = royalty * 0.02;
    
    const totalDemand = royalty + deadRent + dmft + interest + nmet + itCess + managementFee + environmentCess;

    setResults({
      royalty,
      deadRent,
      dmft,
      interest,
      nmet,
      itCess,
      managementFee,
      environmentCess,
      totalDemand,
    });
  };

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'mineral' || field === 'quality' ? value : (typeof value === 'string' ? parseFloat(value) || 0 : value)
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Rent,Royalty,Fees & other sum due to the Government Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-dark">Input Parameters</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mineral Name
            </label>
            <select
              value={inputs.mineral}
              onChange={(e) => handleInputChange('mineral', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="">Select mineral ({minerals.length} available)</option>
              {uniqueMineralNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality
            </label>
            <select
              value={inputs.quality}
              onChange={(e) => handleInputChange('quality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={!inputs.mineral}
            >
              <option value="">Select quality</option>
              {availableQualities.map(quality => (
                <option key={quality} value={quality}>{quality}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Royalty Rate (₹/{selectedMineral?.unit || 'unit'})
            </label>
            <input
              type="number"
              value={inputs.royaltyRate}
              onChange={(e) => handleInputChange('royaltyRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary bg-gray-50"
              placeholder="Auto-filled from database"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity ({selectedMineral?.unit || 'tonne'})
            </label>
            <input
              type="number"
              value={inputs.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (acres)
            </label>
            <input
              type="number"
              value={inputs.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              placeholder="Enter area in acres"
            />
          </div>

          <button
            onClick={calculateDemand}
            className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition font-medium"
          >
            Calculate Monthly Demand
          </button>
        </div>

        {results && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-dark">Calculation Results</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Royalty:</span>
                <span className="font-medium">₹{results.royalty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dead Rent (Quarterly):</span>
                <span className="font-medium">₹{results.deadRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">DMFT (30% of Royalty):</span>
                <span className="font-medium">₹{results.dmft.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interest (24% annually):</span>
                <span className="font-medium">₹{results.interest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">NMET (2% of Royalty):</span>
                <span className="font-medium">₹{results.nmet.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">IT Cess (2% of Royalty):</span>
                <span className="font-medium">₹{results.itCess.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Management Fee (₹1/tonne):</span>
                <span className="font-medium">₹{results.managementFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Environment Cess (2% of Royalty):</span>
                <span className="font-medium">₹{results.environmentCess.toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold text-brand-dark">
                <span>Total Monthly Demand:</span>
                <span>₹{results.totalDemand.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningCalculator;