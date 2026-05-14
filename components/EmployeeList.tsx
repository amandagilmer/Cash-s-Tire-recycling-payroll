
import React, { useState } from 'react';
import { Employee, EmploymentType } from '../types';
import { Search, UserPlus, Mail, MapPin, DollarSign, CircleParking } from 'lucide-react';

interface Props {
  employees: Employee[];
  onAdd: (emp: Omit<Employee, 'id'>) => void;
}

const EmployeeList: React.FC<Props> = ({ employees, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    ssn: '',
    address: '',
    hourlyRate: 15,
    defaultTireRate: 0.20,
    type: EmploymentType.W2,
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {emp.firstName[0]}{emp.lastName[0]}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                emp.type === EmploymentType.W2 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {emp.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{emp.firstName} {emp.lastName}</h3>
            <div className="space-y-2 mt-4 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Mail size={14} /> {emp.email}</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> {emp.address}</p>
              <div className="flex gap-4 mt-2">
                <p className="flex items-center gap-1 font-semibold text-slate-800"><DollarSign size={14} /> ${emp.hourlyRate}/h</p>
                <p className="flex items-center gap-1 font-semibold text-indigo-600"><CircleParking size={14} /> ${emp.defaultTireRate}/tire</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t flex justify-between">
              <button className="text-blue-600 text-sm font-medium hover:underline">Edit Profile</button>
              <button className="text-slate-600 text-sm font-medium hover:underline">View History</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <h2 className="text-2xl font-bold mb-6">New Employee Record</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                  <input required className="w-full border rounded-lg px-3 py-2" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                  <input required className="w-full border rounded-lg px-3 py-2" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input required type="email" className="w-full border rounded-lg px-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Employment Type</label>
                <select className="w-full border rounded-lg px-3 py-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as EmploymentType})}>
                  <option value={EmploymentType.W2}>W-2 Employee</option>
                  <option value={EmploymentType.CONTRACTOR}>1099 Contractor</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Hourly Rate ($)</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Default Tire Commission ($)</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={formData.defaultTireRate} onChange={e => setFormData({...formData, defaultTireRate: Number(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">SSN / TIN</label>
                <input required placeholder="***-**-****" className="w-full border rounded-lg px-3 py-2" value={formData.ssn} onChange={e => setFormData({...formData, ssn: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
