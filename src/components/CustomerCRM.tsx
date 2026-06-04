import { useState, useEffect } from 'react';
import { IconUsers, IconAdd, IconDelete, IconPhone, IconHeart } from './Icons';

interface Customer {
  id: string;
  name: string;
  phone: string;
  birthday: string;
  visits: number;
  lastVisit: string;
}

export default function CustomerCRM() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('inv_customer_data') || '[]');
    } catch {
      return [];
    }
  });

  const [newCust, setNewCust] = useState({ name: '', phone: '', birthday: '' });

  useEffect(() => {
    localStorage.setItem('inv_customer_data', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = () => {
    if (!newCust.name || !newCust.phone) return;
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCust,
      visits: 1,
      lastVisit: new Date().toLocaleDateString('en-IN'),
    };
    setCustomers([customer, ...customers]);
    setNewCust({ name: '', phone: '', birthday: '' });
  };

  const removeCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="glass-panel">
        <h3 className="text-lg font-bold mb-4 text-amber-400 flex items-center gap-2">
          <IconUsers className="w-5 h-5" /> Customer Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <input 
            className="retro-input" 
            placeholder="Customer Name" 
            value={newCust.name}
            onChange={e => setNewCust({ ...newCust, name: e.target.value })}
          />
          <input 
            className="retro-input" 
            placeholder="Phone Number" 
            value={newCust.phone}
            onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
          />
          <div className="input-group">
            <input 
              className="retro-input" 
              type="date"
              value={newCust.birthday}
              onChange={e => setNewCust({ ...newCust, birthday: e.target.value })}
            />
          </div>
          <button className="print-btn !py-2" onClick={addCustomer}>
            <IconAdd className="w-4 h-4 mx-auto" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <div key={c.id} className="glass-panel !p-4 border border-white/5 hover:border-amber-400/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 font-bold">
                  {c.name.charAt(0)}
                </div>
                <button className="text-gray-500 hover:text-red-400" onClick={() => removeCustomer(c.id)}>
                  <IconDelete className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-bold text-white mb-1">{c.name}</h4>
              <div className="space-y-1.5 text-xs text-gray-400">
                <p className="flex items-center gap-2"><IconPhone className="w-3 h-3" /> {c.phone}</p>
                {c.birthday && <p className="flex items-center gap-2"><IconHeart className="w-3 h-3 text-pink-400" /> {c.birthday}</p>}
                <div className="pt-2 mt-2 border-t border-white/5 flex justify-between">
                  <span>Visits: <b className="text-white">{c.visits}</b></span>
                  <span>Last: <b className="text-white">{c.lastVisit}</b></span>
                </div>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-500 text-sm">
              No customers added yet. Start by adding one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
