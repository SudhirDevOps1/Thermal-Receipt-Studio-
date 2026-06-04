import { useState, useEffect } from 'react';
import { IconShoppingBag, IconAdd, IconDelete, IconAlert } from './Icons';

interface StockItem {
  name: string;
  count: number;
  minLevel: number;
  unit: string;
}

export default function StockManager() {
  const [stock, setStock] = useState<StockItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('inv_stock_data') || '[]');
    } catch {
      return [];
    }
  });

  const [newItem, setNewItem] = useState({ name: '', count: 0, minLevel: 5, unit: 'kg' });

  useEffect(() => {
    localStorage.setItem('inv_stock_data', JSON.stringify(stock));
  }, [stock]);

  const addStock = () => {
    if (!newItem.name) return;
    setStock([...stock, { ...newItem }]);
    setNewItem({ name: '', count: 0, minLevel: 5, unit: 'kg' });
  };

  const removeStock = (index: number) => {
    setStock(stock.filter((_, i) => i !== index));
  };

  const updateCount = (index: number, delta: number) => {
    setStock(stock.map((item, i) => i === index ? { ...item, count: Math.max(0, item.count + delta) } : item));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="glass-panel">
        <h3 className="text-lg font-bold mb-4 text-amber-400 flex items-center gap-2">
          <IconShoppingBag className="w-5 h-5" /> Stock Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input 
            className="retro-input" 
            placeholder="Item Name" 
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input 
            className="retro-input" 
            type="number"
            placeholder="Current Stock" 
            value={newItem.count}
            onChange={e => setNewItem({ ...newItem, count: parseInt(e.target.value) || 0 })}
          />
          <input 
            className="retro-input" 
            type="number"
            placeholder="Min Alert Level" 
            value={newItem.minLevel}
            onChange={e => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) || 0 })}
          />
          <button className="print-btn !py-2" onClick={addStock}>
            <IconAdd className="w-4 h-4 mx-auto" />
          </button>
        </div>

        <div className="inv-wrapper">
          <div className="inv-scroll">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th className="text-center">Current</th>
                  <th className="text-center">Actions</th>
                  <th className="text-center">Min Level</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stock.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-bold text-white">{item.name}</td>
                    <td>
                      {item.count <= item.minLevel ? (
                        <span className="badge bg-red-500/20 text-red-400 flex items-center gap-1 w-fit">
                          <IconAlert className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="badge bg-green-500/20 text-green-400 flex items-center gap-1 w-fit">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="text-center text-amber-400 font-mono text-lg">{item.count} {item.unit}</td>
                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <button className="retro-btn !p-1 w-8 h-8" onClick={() => updateCount(idx, -1)}>-</button>
                        <button className="retro-btn !p-1 w-8 h-8" onClick={() => updateCount(idx, 1)}>+</button>
                      </div>
                    </td>
                    <td className="text-center text-gray-500">{item.minLevel}</td>
                    <td className="text-right">
                      <button className="inv-remove-btn" onClick={() => removeStock(idx)}><IconDelete className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


