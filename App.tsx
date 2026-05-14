
import React, { useState, useEffect } from 'react';
import { Layout, Users, FileText, Settings, CreditCard, ChevronRight, Plus, Download, Printer } from 'lucide-react';
import { Employee, EmploymentType, PayPeriod, BusinessProfile } from './types';
import EmployeeList from './components/EmployeeList';
import PayrollDashboard from './components/PayrollDashboard';
import DocumentGenerator from './components/DocumentGenerator';
import SettingsView from './components/SettingsView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'documents' | 'settings'>('dashboard');
  
  // Persistent State Logic
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('payroll_employees');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [payrollHistory, setPayrollHistory] = useState<PayPeriod[]>(() => {
    const saved = localStorage.getItem('payroll_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('payroll_profile');
    return saved ? JSON.parse(saved) : {
      name: "Cash's Tire Recycling Inc",
      ein: "86-2058991",
      address: "1 Northwood Country Ln\nHuffman, TX 77336"
    };
  });

  // Sync to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('payroll_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('payroll_history', JSON.stringify(payrollHistory));
  }, [payrollHistory]);

  useEffect(() => {
    localStorage.setItem('payroll_profile', JSON.stringify(businessProfile));
  }, [businessProfile]);

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    setEmployees([...employees, { ...emp, id: Date.now().toString() }]);
  };

  const processPayroll = (period: PayPeriod) => {
    setPayrollHistory([period, ...payrollHistory]);
  };

  const handleRestore = (data: any) => {
    if (data.employees) setEmployees(data.employees);
    if (data.history) setPayrollHistory(data.history);
    if (data.businessProfile) setBusinessProfile(data.businessProfile);
  };

  const fullData = { employees, history: payrollHistory, businessProfile };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <nav className="w-64 bg-slate-900 text-white flex flex-col no-print shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="text-blue-400" />
            PayrollPro
          </h1>
        </div>
        
        <div className="flex-1 py-6 space-y-2">
          <SidebarItem icon={<Layout size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Users size={20} />} label="Employees" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <SidebarItem icon={<FileText size={20} />} label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </div>

        <div className="p-4 bg-slate-800 m-4 rounded-lg">
          <p className="text-xs text-slate-400">Business</p>
          <p className="text-sm font-medium truncate">{businessProfile.name}</p>
        </div>
      </nav>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto print:overflow-visible print:h-auto">
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 no-print shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold capitalize text-slate-800">{activeTab}</h2>
            <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{businessProfile.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Last Payroll: {payrollHistory[0]?.endDate || 'Never'}</span>
            <button onClick={() => setActiveTab('dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md">Run Payroll</button>
          </div>
        </header>

        <div className="flex-1 p-8 print:p-0">
          {activeTab === 'dashboard' && <PayrollDashboard employees={employees} history={payrollHistory} onProcess={processPayroll} />}
          {activeTab === 'employees' && <EmployeeList employees={employees} onAdd={addEmployee} />}
          {activeTab === 'documents' && <DocumentGenerator employees={employees} history={payrollHistory} businessProfile={businessProfile} />}
          {activeTab === 'settings' && <SettingsView profile={businessProfile} onSave={setBusinessProfile} fullData={fullData} onRestore={handleRestore} />}
        </div>
      </main>
    </div>
  );
};

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${active ? 'bg-blue-600 text-white shadow-lg z-10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon}
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </button>
);

export default App;
