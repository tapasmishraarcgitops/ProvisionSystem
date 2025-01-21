import React, { useState } from 'react';
import { Settings, Trash2, Server, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { System, Version, ProvisioningStatus } from './types';
import { triggerProvisioningPipeline, triggerDeprovisioningPipeline } from './services/azureDevOps';

// Mock data - replace with actual API calls
const availableSystems: System[] = [
  { name: 'system1', displayName: 'System One' },
  { name: 'system2', displayName: 'System Two' },
  { name: 'system3', displayName: 'System Three' },
];

const availableVersions: Version[] = [
  { id: '1', version: '1.0.0' },
  { id: '2', version: '1.1.0' },
  { id: '3', version: '2.0.0' },
];

function App() {
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [status, setStatus] = useState<ProvisioningStatus>({
    isProvisioning: false,
    isDeprovisioning: false,
    error: null,
    success: false,
  });

  const handleSystemToggle = (systemName: string) => {
    setSelectedSystems(prev =>
      prev.includes(systemName)
        ? prev.filter(sys => sys !== systemName)
        : [...prev, systemName]
    );
  };

  const handleProvision = async () => {
    if (selectedSystems.length === 0 || !selectedVersion) {
      setStatus(prev => ({
        ...prev,
        error: 'Please select at least one system and a version',
        success: false,
      }));
      return;
    }

    setStatus(prev => ({ ...prev, isProvisioning: true, error: null, success: false }));

    try {
      await triggerProvisioningPipeline({
        systemNames: selectedSystems,
        version: selectedVersion,
      });
      
      setStatus(prev => ({ ...prev, isProvisioning: false, error: null, success: true }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isProvisioning: false,
        error: 'Failed to provision systems. Please try again.',
        success: false,
      }));
    }
  };

  const handleDeprovision = async () => {
    if (selectedSystems.length === 0) {
      setStatus(prev => ({
        ...prev,
        error: 'Please select at least one system to deprovision',
        success: false,
      }));
      return;
    }

    setStatus(prev => ({ ...prev, isDeprovisioning: true, error: null, success: false }));

    try {
      await triggerDeprovisioningPipeline({
        systemNames: selectedSystems,
        version: selectedVersion,
      });
      
      setStatus(prev => ({ ...prev, isDeprovisioning: false, error: null, success: true }));
      
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isDeprovisioning: false,
        error: 'Failed to deprovision systems. Please try again.',
        success: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                System Provisioning Portal
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Systems</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSystems.map((system) => (
                  <label
                    key={system.name}
                    className={`
                      relative flex items-center p-4 rounded-lg border cursor-pointer
                      hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500
                      ${selectedSystems.includes(system.name) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                    `}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={selectedSystems.includes(system.name)}
                      onChange={() => handleSystemToggle(system.name)}
                    />
                    <span className="ml-3 flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{system.displayName}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Version</h2>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select a version</option>
                {availableVersions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version}
                  </option>
                ))}
              </select>
            </div>

            {status.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{status.error}</p>
                  </div>
                </div>
              </div>
            )}

            {status.success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Operation completed successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleProvision}
                disabled={status.isProvisioning || status.isDeprovisioning}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {status.isProvisioning ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Settings className="-ml-1 mr-2 h-4 w-4" />
                )}
                Provision
              </button>

              <button
                onClick={handleDeprovision}
                disabled={status.isProvisioning || status.isDeprovisioning}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {status.isDeprovisioning ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                ) : (
                  <Trash2 className="-ml-1 mr-2 h-4 w-4" />
                )}
                Deprovision
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;