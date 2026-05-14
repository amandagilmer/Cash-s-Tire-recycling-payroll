
import React, { useState, useEffect } from 'react';
import { Employee, PayPeriod, EmploymentType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Upload, Filter, History, Clock, CheckCircle2, CircleParking, Gift } from 'lucide-react';

interface Props {
  employees: Employee[];
  history: PayPeriod[];
  onProcess: (period: PayPeriod) => void;
}

const PayrollDashboard: React.FC<Props> = ({ employees, history, onProcess }) => {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [hours, setHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [tireCount, setTireCount] = useState<number>(0);
  const [tireRateOverride, setTireRateOverride] = useState<number>(0);
  const [christmasBonus, setChristmasBonus] = useState<number>(0);
  const [withholdTax, setWithholdTax] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);
  const filteredHistory = history.filter(h => h.year === filterYear);

  useEffect(() => {
    if (selectedEmployee) {
      setTireRateOverride(selectedEmployee.defaultTireRate);
    }
  }, [selectedEmpId, selectedEmployee]);

  const handleProcess = () => {
    if (!selectedEmployee) return;
    
    const regPay = hours * selectedEmployee.hourlyRate;
    const otPay = overtimeHours * (selectedEmployee.hourlyRate * 1.5);
    const commPay = tireCount * tireRateOverride;
    const bonusPay = christmasBonus || 0;
    const gross = regPay + otPay + commPay + bonusPay;
    
    const tax = (withholdTax && selectedEmployee.type === EmploymentType.W2) ? gross * 0.20 : 0;
    
    const newPeriod: PayPeriod = {
      id: Date.now().toString(),
      employeeId: selectedEmployee.id,
      startDate,
      endDate,
      year: new Date(endDate).getFullYear(),
      hoursWorked: hours,
      overtimeHours: overtimeHours,
      tireCount: tireCount,
      tireRateUsed: tireRateOverride,
      commissionPay: commPay,
      christmasBonus: bonusPay,
      grossPay: gross,
      taxWithheld: tax,
      netPay: gross - tax,
      status: 'Paid'
    };
    
    onProcess(newPeriod);
    setHours(0);
    setOvertimeHours(0);
    setTireCount(0);
    setChristmasBonus(0);
    setSelectedEmpId('');
  };

  const stats = [
    { label: `Paid in ${filterYear}`, value: `$${filteredHistory.reduce((a, b) => a + b.netPay, 0).toLocaleString()}`, icon: <DollarSign className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Active Staff', value: employees.length, icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Tires Processed', value: filteredHistory.reduce((a, b) => a + (b.tireCount || 0), 0).toLocaleString(), icon: <CircleParking className="text-indigo-600" />, bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <Filter size={18} className="text-slate-400 ml-2" />
          <span className="text-sm font-bold text-slate-600">Year:</span>
          {[2023, 2024, 2025].map(y => (
            <button 
              key={y} 
              onClick={() => setFilterYear(y)}
              className={`px-4 py-1 rounded-lg text-sm font-bold transition-all ${filterYear === y ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Process Pay Period
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Select Recipient</label>
              <select 
                className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
              >
                <option value="">Choose an employee...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Start Date</label>
                <input type="date" className="w-full p-3 border rounded-xl bg-slate-50" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">End Date</label>
                <input type="date" className="w-full p-3 border rounded-xl bg-slate-50" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            {selectedEmployee && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Regular Hours</label>
                    <input type="number" className="w-full p-3 border rounded-xl bg-slate-50" value={hours} onChange={e => setHours(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">Overtime Hours</label>
                    <input type="number" className="w-full p-3 border rounded-xl bg-slate-50" value={overtimeHours} onChange={e => setOvertimeHours(Number(e.target.value))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <label className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-2">
                      <CircleParking size={16} /> Tires
                    </label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Count" className="w-full p-2 border rounded-lg bg-white" value={tireCount || ''} onChange={e => setTireCount(Number(e.target.value))} />
                      <input type="number" step="0.01" className="w-24 p-2 border rounded-lg bg-white" value={tireRateOverride} onChange={e => setTireRateOverride(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <label className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">
                      <Gift size={16} /> Year-End Bonus
                    </label>
                    <input type="number" step="0.01" placeholder="$ Bonus" className="w-full p-2 border rounded-lg bg-white" value={christmasBonus || ''} onChange={e => setChristmasBonus(Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <button onClick={() => setWithholdTax(!withholdTax)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${withholdTax ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${withholdTax ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-medium text-slate-600">Apply Federal Tax Withholding</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="text-slate-500 text-sm">Gross Total:</span>
                    <span className="font-bold text-slate-900">
                      ${((hours * selectedEmployee.hourlyRate) + (overtimeHours * selectedEmployee.hourlyRate * 1.5) + (tireCount * tireRateOverride) + (christmasBonus || 0)).toFixed(2)}
                    </span>
                  </div>
                  <button onClick={handleProcess} disabled={hours + overtimeHours + tireCount + christmasBonus <= 0} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
                    <CheckCircle2 size={18} /> Confirm & Record Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-full">
          <h3 className="text-xl font-bold mb-6">Payroll Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredHistory.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="endDate" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="grossPay" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="font-bold uppercase text-xs tracking-widest text-slate-400">Transaction History ({filterYear})</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black">
            <tr>
              <th className="px-6 py-4">Recipient</th>
              <th className="px-6 py-4">Range</th>
              <th className="px-6 py-4 text-right">Tires</th>
              <th className="px-6 py-4 text-right">Bonus</th>
              <th className="px-6 py-4 text-right font-black">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredHistory.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No records found for {filterYear}</td></tr>
            ) : (
              filteredHistory.map(item => {
                const emp = employees.find(e => e.id === item.employeeId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{emp?.firstName} {emp?.lastName}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{item.startDate} — {item.endDate}</td>
                    <td className="px-6 py-4 text-right font-medium text-indigo-600">{item.tireCount || 0}</td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">${item.christmasBonus?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">${item.netPay.toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollDashboard;
