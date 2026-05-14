
import React, { useState, useEffect } from 'react';
import { Employee, PayPeriod, BusinessProfile, EmploymentType } from '../types';
import { Download, Printer, FileCheck, AlertCircle, Calendar, Edit3, Database, CircleParking, Gift } from 'lucide-react';

interface Props {
  employees: Employee[];
  history: PayPeriod[];
  businessProfile: BusinessProfile;
}

const DocumentGenerator: React.FC<Props> = ({ employees, history, businessProfile }) => {
  const [selectedDoc, setSelectedDoc] = useState<'stub' | '1099' | null>(null);
  const [entryMode, setEntryMode] = useState<'history' | 'manual'>('history');
  
  const [manualData, setManualData] = useState({
    businessName: businessProfile.name,
    businessAddress: businessProfile.address,
    businessEin: businessProfile.ein,
    employeeName: '',
    employeeAddress: '',
    employeeSsn: '***-**-****',
    startDate: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    payDate: new Date().toISOString().split('T')[0],
    hours: 40,
    overtimeHours: 0,
    tireCount: 0,
    tireRate: 0.20,
    rate: 20,
    taxRate: 0,
    christmasBonus: 0
  });

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [selectedPayId, setSelectedPayId] = useState('');
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  const selectedEmp = employees.find(e => e.id === selectedEmpId);
  const selectedPay = history.find(p => p.id === selectedPayId);

  useEffect(() => {
    setManualData(prev => ({
      ...prev,
      businessName: businessProfile.name,
      businessAddress: businessProfile.address,
      businessEin: businessProfile.ein
    }));
  }, [businessProfile]);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.print();
  };

  const calculateYTD = (empId: string, year: number) => {
    return history
      .filter(h => h.employeeId === empId && h.year === year)
      .reduce((acc, curr) => ({
        gross: acc.gross + curr.grossPay,
        tax: acc.tax + curr.taxWithheld,
        net: acc.net + curr.netPay
      }), { gross: 0, tax: 0, net: 0 });
  };

  const manualRegGross = manualData.hours * manualData.rate;
  const manualOtGross = manualData.overtimeHours * (manualData.rate * 1.5);
  const manualCommGross = manualData.tireCount * manualData.tireRate;
  const manualBonusGross = manualData.christmasBonus || 0;
  const manualGross = manualRegGross + manualOtGross + manualCommGross + manualBonusGross;
  const manualTax = manualGross * manualData.taxRate;
  const manualNet = manualGross - manualTax;

  const canShowStub = selectedDoc === 'stub' && (
    (entryMode === 'history' && selectedPay && selectedEmp) || 
    (entryMode === 'manual' && manualData.employeeName.trim() !== '')
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 no-print shadow-sm">
        <Calendar size={18} className="text-blue-600" />
        <span className="font-bold text-slate-700">Reporting Year:</span>
        <select 
          value={reportYear} 
          onChange={(e) => setReportYear(Number(e.target.value))}
          className="bg-slate-50 border rounded-lg px-3 py-1 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      <div className="flex gap-4 no-print">
        <button onClick={() => setSelectedDoc('stub')} className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left ${selectedDoc === 'stub' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
          <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4"><FileCheck size={20} /></div>
          <h4 className="font-bold text-lg">Pay Stub Generator</h4>
          <p className="text-sm text-slate-500 mt-1">Include overtime, tires, and bonuses.</p>
        </button>
        <button onClick={() => setSelectedDoc('1099')} className={`flex-1 p-6 rounded-2xl border-2 transition-all text-left ${selectedDoc === '1099' ? 'border-purple-600 bg-purple-50' : 'border-slate-200 bg-white hover:border-purple-300'}`}>
          <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center text-white mb-4"><AlertCircle size={20} /></div>
          <h4 className="font-bold text-lg">Form 1099-NEC</h4>
          <p className="text-sm text-slate-500 mt-1">Year-end reporting for contractors.</p>
        </button>
      </div>

      {selectedDoc === 'stub' && (
        <div className="space-y-6 no-print">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-fit">
            <button onClick={() => setEntryMode('history')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${entryMode === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><Database size={16} /> From Records</button>
            <button onClick={() => setEntryMode('manual')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${entryMode === 'manual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}><Edit3 size={16} /> Manual Entry</button>
          </div>

          <div className="bg-white p-8 rounded-2xl border shadow-sm">
            {entryMode === 'history' ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Select Employee</label>
                  <select className="w-full p-3 border rounded-xl" value={selectedEmpId} onChange={e => { setSelectedEmpId(e.target.value); setSelectedPayId(''); }}>
                    <option value="">Choose...</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Select Pay Period</label>
                  <select className="w-full p-3 border rounded-xl disabled:opacity-50" value={selectedPayId} onChange={e => setSelectedPayId(e.target.value)} disabled={!selectedEmpId}>
                    <option value="">Choose Period...</option>
                    {history.filter(h => h.employeeId === selectedEmpId && h.year === reportYear).map(h => (
                      <option key={h.id} value={h.id}>{h.startDate} to {h.endDate} (${h.grossPay.toFixed(2)})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider">Start Date</label><input type="date" className="w-full p-2 border rounded-lg" value={manualData.startDate} onChange={e => setManualData({...manualData, startDate: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider">End Date</label><input type="date" className="w-full p-2 border rounded-lg" value={manualData.endDate} onChange={e => setManualData({...manualData, endDate: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-xs font-black text-slate-500 uppercase tracking-wider">Pay Date</label><input type="date" className="w-full p-2 border rounded-lg" value={manualData.payDate} onChange={e => setManualData({...manualData, payDate: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employee Name</label><input className="w-full p-2 border rounded-lg" value={manualData.employeeName} onChange={e => setManualData({...manualData, employeeName: e.target.value})} placeholder="Enter name to preview..." /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reg Hours</label><input type="number" className="w-full p-2 border rounded-lg" value={manualData.hours} onChange={e => setManualData({...manualData, hours: Number(e.target.value)})} /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">OT Hours</label><input type="number" className="w-full p-2 border rounded-lg" value={manualData.overtimeHours} onChange={e => setManualData({...manualData, overtimeHours: Number(e.target.value)})} /></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100"><label className="block text-xs font-bold text-indigo-600 uppercase mb-1">Tire Count</label><input type="number" className="w-full p-2 border border-indigo-200 rounded-lg" value={manualData.tireCount} onChange={e => setManualData({...manualData, tireCount: Number(e.target.value)})} /></div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100"><label className="block text-xs font-bold text-red-600 flex items-center gap-1 uppercase mb-1"><Gift size={12} /> Bonus ($)</label><input type="number" step="0.01" className="w-full p-2 border border-red-200 rounded-lg" value={manualData.christmasBonus} onChange={e => setManualData({...manualData, christmasBonus: Number(e.target.value)})} /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rate ($)</label><input type="number" step="0.01" className="w-full p-2 border rounded-lg" value={manualData.rate} onChange={e => setManualData({...manualData, rate: Number(e.target.value)})} /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tax (%)</label><input type="number" className="w-full p-2 border rounded-lg" value={manualData.taxRate * 100} onChange={e => setManualData({...manualData, taxRate: Number(e.target.value) / 100})} /></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {canShowStub && (
        <div className="print-container bg-white p-12 shadow-xl max-w-4xl mx-auto border rounded-lg print:shadow-none print:m-0 print:border-none print:p-0">
          <div className="flex justify-between border-b-2 pb-8 mb-8 border-slate-900">
            <div>
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">{entryMode === 'manual' ? manualData.businessName : businessProfile.name}</h1>
              <p className="text-slate-500 whitespace-pre-line text-sm">{entryMode === 'manual' ? manualData.businessAddress : businessProfile.address}</p>
              <p className="text-slate-500 text-sm font-bold">EIN: {entryMode === 'manual' ? manualData.businessEin : businessProfile.ein}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest border-b-2 border-slate-200 pb-1 mb-2">Earnings Statement</h2>
              <div className="grid grid-cols-2 gap-x-4 text-[10px] uppercase font-bold text-slate-400">
                <span className="text-right">Period Start:</span> <span className="text-slate-900 text-left">{entryMode === 'manual' ? manualData.startDate : selectedPay!.startDate}</span>
                <span className="text-right">Period End:</span> <span className="text-slate-900 text-left">{entryMode === 'manual' ? manualData.endDate : selectedPay!.endDate}</span>
                <span className="text-right">Pay Date:</span> <span className="text-slate-900 text-left">{entryMode === 'manual' ? manualData.payDate : selectedPay!.endDate}</span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-left">Employee Information</h3>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-left print:bg-transparent">
              <p className="font-black text-xl text-slate-900">{entryMode === 'manual' ? manualData.employeeName : `${selectedEmp!.firstName} ${selectedEmp!.lastName}`}</p>
              <p className="text-slate-600 text-sm">{entryMode === 'manual' ? manualData.employeeAddress : selectedEmp!.address}</p>
              <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase">SSN / TIN: {entryMode === 'manual' ? manualData.employeeSsn : selectedEmp!.ssn}</p>
            </div>
          </div>

          <table className="w-full border-collapse mb-10">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-2 px-4 text-left text-[10px] font-black uppercase">Description</th>
                <th className="py-2 px-4 text-center text-[10px] font-black uppercase">Qty/Hours</th>
                <th className="py-2 px-4 text-center text-[10px] font-black uppercase">Rate</th>
                <th className="py-2 px-4 text-right text-[10px] font-black uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-b-2 border-slate-200">
              <tr>
                <td className="py-4 px-4 text-sm font-bold text-slate-800 uppercase tracking-tight text-left">Regular Wages</td>
                <td className="py-4 px-4 text-center text-sm font-medium">{entryMode === 'manual' ? manualData.hours.toFixed(2) : selectedPay!.hoursWorked.toFixed(2)}</td>
                <td className="py-4 px-4 text-center text-sm font-medium">${entryMode === 'manual' ? manualData.rate.toFixed(2) : selectedEmp!.hourlyRate.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-sm font-bold">${entryMode === 'manual' ? manualRegGross.toFixed(2) : (selectedPay!.hoursWorked * selectedEmp!.hourlyRate).toFixed(2)}</td>
              </tr>
              {((entryMode === 'manual' && manualData.overtimeHours > 0) || (entryMode === 'history' && selectedPay!.overtimeHours > 0)) && (
                <tr className="bg-slate-50/50">
                  <td className="py-4 px-4 text-sm font-bold text-slate-800 uppercase tracking-tight text-left">Overtime (1.5x)</td>
                  <td className="py-4 px-4 text-center text-sm font-medium">{entryMode === 'manual' ? manualData.overtimeHours.toFixed(2) : selectedPay!.overtimeHours.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center text-sm font-medium">${entryMode === 'manual' ? (manualData.rate * 1.5).toFixed(2) : (selectedEmp!.hourlyRate * 1.5).toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-sm font-bold">${entryMode === 'manual' ? manualOtGross.toFixed(2) : (selectedPay!.overtimeHours * selectedEmp!.hourlyRate * 1.5).toFixed(2)}</td>
                </tr>
              )}
              {((entryMode === 'manual' && manualData.tireCount > 0) || (entryMode === 'history' && selectedPay!.tireCount > 0)) && (
                <tr className="bg-indigo-50/20">
                  <td className="py-4 px-4 text-sm font-bold text-indigo-900 uppercase tracking-tight text-left">
                    <div className="flex items-center gap-2"><CircleParking size={14} /> Tire Commission</div>
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-medium">{entryMode === 'manual' ? manualData.tireCount : selectedPay!.tireCount}</td>
                  <td className="py-4 px-4 text-center text-sm font-medium">${entryMode === 'manual' ? manualData.tireRate.toFixed(2) : selectedPay!.tireRateUsed.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-sm font-black text-indigo-700">${entryMode === 'manual' ? manualCommGross.toFixed(2) : selectedPay!.commissionPay.toFixed(2)}</td>
                </tr>
              )}
              {((entryMode === 'manual' && manualData.christmasBonus > 0) || (entryMode === 'history' && selectedPay!.christmasBonus > 0)) && (
                <tr className="bg-red-50/20">
                  <td className="py-4 px-4 text-sm font-bold text-red-900 uppercase tracking-tight text-left">
                    <div className="flex items-center gap-2"><Gift size={14} /> Performance Bonus</div>
                  </td>
                  <td className="py-4 px-4 text-center">1</td>
                  <td className="py-4 px-4 text-center">${entryMode === 'manual' ? manualData.christmasBonus.toFixed(2) : selectedPay!.christmasBonus.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-sm font-black text-red-700">${entryMode === 'manual' ? manualData.christmasBonus.toFixed(2) : selectedPay!.christmasBonus.toFixed(2)}</td>
                </tr>
              )}
              {((entryMode === 'history' && selectedPay!.taxWithheld > 0) || (entryMode === 'manual' && manualTax > 0)) && (
                <tr>
                  <td className="py-4 px-4 text-sm font-medium text-red-600 text-left">Federal Tax Withholding</td>
                  <td></td><td></td>
                  <td className="py-4 px-4 text-right text-sm text-red-600 font-bold">-${entryMode === 'manual' ? manualTax.toFixed(2) : selectedPay!.taxWithheld.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-start">
             <div className="text-[10px] text-slate-400 font-mono italic">ID: {entryMode === 'manual' ? 'MANUAL' : selectedPay!.id}</div>
            <div className="w-64 bg-slate-900 text-white p-6 rounded-xl text-right shadow-lg border-t-4 border-blue-500">
              <p className="text-[10px] uppercase font-black text-blue-400 mb-1 tracking-widest">Total Net Paid</p>
              <p className="text-4xl font-black tracking-tighter">${entryMode === 'manual' ? manualNet.toFixed(2) : selectedPay!.netPay.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center no-print">
            <button type="button" onClick={handlePrint} className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-xl font-black hover:bg-black shadow-2xl transition-all hover:-translate-y-1 active:scale-95 cursor-pointer">
              <Printer size={24} className="group-hover:animate-bounce" /> GENERATE PDF & PRINT
            </button>
          </div>
        </div>
      )}

      {selectedDoc === '1099' && selectedEmp && (
        <div className="print-container bg-slate-50 p-12 max-w-4xl mx-auto border rounded-lg border-slate-300 print:bg-white print:border-none print:p-8">
          <div className="flex justify-between items-center mb-10 border-b-4 border-slate-900 pb-4">
             <div className="text-3xl font-black uppercase">Form 1099-NEC</div>
             <div className="text-4xl font-black">{reportYear}</div>
          </div>
          <div className="grid grid-cols-2 border-2 border-slate-900 text-left">
             <div className="p-4 border-r-2 border-b-2 border-slate-900 h-32">
                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Payer's Name, Address, City, State, ZIP</label>
                <div className="text-sm font-bold whitespace-pre-line">{businessProfile.name}<br/>{businessProfile.address}</div>
             </div>
             <div className="p-4 border-b-2 border-slate-900 h-32">
                <div className="text-[10px] font-bold text-slate-500 uppercase">1 Nonemployee Compensation</div>
                <div className="text-3xl font-black mt-4">${calculateYTD(selectedEmp.id, reportYear).gross.toLocaleString()}</div>
             </div>
             <div className="p-4 border-r-2 border-b-2 border-slate-900 h-24">
                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Payer's TIN</label>
                <div className="text-sm font-bold">{businessProfile.ein}</div>
             </div>
             <div className="p-4 border-b-2 border-slate-900 h-24">
                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Recipient's TIN</label>
                <div className="text-sm font-bold">{selectedEmp.ssn}</div>
             </div>
             <div className="p-4 border-r-2 border-slate-900 col-span-1 h-32">
                <label className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Recipient's Name</label>
                <div className="text-lg font-bold">{selectedEmp.firstName} {selectedEmp.lastName}</div>
                <div className="text-sm mt-2">{selectedEmp.address}</div>
             </div>
             <div className="p-4 h-32 flex flex-col justify-between">
                <div><label className="text-[10px] font-bold uppercase block mb-1 text-slate-500">Account Number</label><div className="text-sm">ID-{selectedEmp.id}</div></div>
                <div className="text-right italic font-serif text-slate-400 text-xs">Recipient Copy</div>
             </div>
          </div>
          <div className="mt-8 flex justify-center no-print">
             <button type="button" onClick={handlePrint} className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-lg transition-all"><Printer size={20} /> Print 1099 Document</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGenerator;
