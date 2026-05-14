
import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { Save, Building2, ShieldCheck, HelpCircle, DownloadCloud, UploadCloud, Trash2 } from 'lucide-react';

interface Props {
  profile: BusinessProfile;
  onSave: (p: BusinessProfile) => void;
  fullData: any;
  onRestore: (data: any) => void;
}

const SettingsView: React.FC<Props> = ({ profile, onSave, fullData, onRestore }) => {
  const [localProfile, setLocalProfile] = useState(profile);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localProfile);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `payroll_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.employees && json.history && json.businessProfile) {
          onRestore(json);
          alert("Backup restored successfully!");
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Building2 className="text-blue-600" />
          Business Profile
        </h3>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Legal Business Name</label>
              <input 
                className="w-full p-3 border rounded-xl bg-slate-50"
                value={localProfile.name}
                onChange={e => setLocalProfile({...localProfile, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Federal EIN / Tax ID</label>
              <input 
                className="w-full p-3 border rounded-xl bg-slate-50"
                placeholder="XX-XXXXXXX"
                value={localProfile.ein}
                onChange={e => setLocalProfile({...localProfile, ein: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Business Address</label>
            <textarea 
              rows={3}
              className="w-full p-3 border rounded-xl bg-slate-50"
              value={localProfile.address}
              onChange={e => setLocalProfile({...localProfile, address: e.target.value})}
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            {showSaved ? (
              <span className="text-green-600 font-bold flex items-center gap-2">
                <ShieldCheck size={20} /> Settings Saved
              </span>
            ) : <div />}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
          <DownloadCloud className="text-blue-600" />
          Database Management
        </h3>
        <p className="text-sm text-slate-500 mb-6">Backup your payroll records to a secure file. You can restore this file on any device to get your information back.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleBackup}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <DownloadCloud size={32} className="text-slate-400 group-hover:text-blue-600 mb-2" />
            <span className="font-bold text-slate-700">Download Backup</span>
            <span className="text-[10px] text-slate-400">Export all records to JSON</span>
          </button>

          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 transition-all group cursor-pointer">
            <UploadCloud size={32} className="text-slate-400 group-hover:text-emerald-600 mb-2" />
            <span className="font-bold text-slate-700">Restore Backup</span>
            <span className="text-[10px] text-slate-400">Import records from file</span>
            <input type="file" className="hidden" accept=".json" onChange={handleRestore} />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
