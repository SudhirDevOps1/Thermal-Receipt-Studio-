import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { IconMoney, IconTrendingUp, IconShoppingBag, IconReceipt } from './Icons';

interface SavedReceipt {
  id: string;
  shopName: string;
  customerName: string;
  subtotal: number;
  grandTotal: number;
  date: string;
}

export default function Dashboard() {
  const history: SavedReceipt[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('inv_receipt_history') || '[]');
    } catch {
      return [];
    }
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = history.reduce((sum, r) => sum + r.grandTotal, 0);
    const totalOrders = history.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by date for chart
    const dailyData: Record<string, number> = {};
    history.forEach(r => {
      const date = r.date;
      dailyData[date] = (dailyData[date] || 0) + r.grandTotal;
    });

    const chartData = Object.entries(dailyData).map(([name, value]) => ({ name, value })).reverse().slice(0, 7);

    return { totalRevenue, totalOrders, avgOrderValue, chartData };
  }, [history]);



  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toFixed(2)}`} 
          icon={<IconMoney className="w-5 h-5 text-amber-400" />} 
          color="border-amber-400/30"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders.toString()} 
          icon={<IconReceipt className="w-5 h-5 text-blue-400" />} 
          color="border-blue-400/30"
        />
        <StatCard 
          title="Avg Bill Value" 
          value={`₹${stats.avgOrderValue.toFixed(2)}`} 
          icon={<IconTrendingUp className="w-5 h-5 text-green-400" />} 
          color="border-green-400/30"
        />
        <StatCard 
          title="Items Sold" 
          value="Calculated live" 
          icon={<IconShoppingBag className="w-5 h-5 text-purple-400" />} 
          color="border-purple-400/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel h-[350px]">
          <h3 className="text-base font-semibold mb-4 text-amber-400">Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c38" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a28', border: '1px solid #2c2c38', borderRadius: '8px' }}
                itemStyle={{ color: '#ffb347' }}
              />
              <Bar dataKey="value" fill="#ffb347" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel h-[350px]">
          <h3 className="text-base font-semibold mb-4 text-amber-400">Sales Growth</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2c2c38" vertical={false} />
              <XAxis dataKey="name" stroke="#666" fontSize={10} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a28', border: '1px solid #2c2c38', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="value" stroke="#ffb347" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className={`glass-panel border-l-4 ${color} p-4 flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-full bg-[#1a1a28] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
