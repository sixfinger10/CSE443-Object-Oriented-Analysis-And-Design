import { useState } from 'react';
import './Sync.css';

interface Device {
  id: number;
  name: string;
  type: string;
  status: 'synced' | 'syncing' | 'error';
  lastSync: string;
}

interface SyncActivity {
  id: number;
  time: string;
  action: string;
  device: string;
}

const Sync = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncOnMobile: false,
  });

  const devices: Device[] = [
    { id: 1, name: 'MacBook Pro', type: 'Desktop', status: 'synced', lastSync: 'Just now' },
    { id: 2, name: 'Work Laptop', type: 'Desktop', status: 'synced', lastSync: '5 minutes ago' },
    { id: 3, name: 'iPhone 13 Pro', type: 'Mobile', status: 'synced', lastSync: '1 hour ago' },
  ];

  const syncActivities: SyncActivity[] = [
    { id: 1, time: '6 seconds ago', action: 'Automatic sync completed', device: 'MacBook Pro' },
    { id: 2, time: '5 minutes ago', action: 'Manual sync from Work Laptop', device: 'Work Laptop' },
    { id: 3, time: '1 hour ago', action: 'Automatic sync completed', device: 'iPhone 13 Pro' },
    { id: 4, time: '2 hours ago', action: 'Conflict resolved', device: 'MacBook Pro' },
  ];

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
  };

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSyncSettings(prev => ({ ...prev, [name]: checked }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return '✓';
      case 'syncing': return '🔄';
      case 'error': return '⚠️';
      default: return '○';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'synced': return 'status-synced';
      case 'syncing': return 'status-syncing';
      case 'error': return 'status-error';
      default: return '';
    }
  };

  return (
    <div className="sync-content">
      <div className="sync-header">
        <h1>Sync Status</h1>
        <p>Keep your library synchronized across all your devices</p>
      </div>

      {/* Sync Status Card */}
      <section className="sync-status-card">
        <div className="status-icon-large">✓</div>
        <h2>All Synced!</h2>
        <p>Your library is up to date across all devices</p>
        <button 
          className={`btn-sync-now ${isSyncing ? 'syncing' : ''}`}
          onClick={handleSyncNow}
          disabled={isSyncing}
        >
          {isSyncing ? '🔄 Syncing...' : '🔄 Sync Now'}
        </button>
      </section>

      {/* Stats */}
      <div className="sync-stats">
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-value">3</div>
          <div className="stat-label">Devices</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">248</div>
          <div className="stat-label">Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-value">5 MB</div>
          <div className="stat-label">Storage</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div className="stat-value">Just now</div>
          <div className="stat-label">Last Sync</div>
        </div>
      </div>

      {/* Connected Devices */}
      <section className="sync-section">
        <h3 className="section-title">Connected Devices</h3>
        <div className="devices-list">
          {devices.map((device) => (
            <div key={device.id} className="device-item">
              <div className="device-info">
                <div className="device-icon">
                  {device.type === 'Desktop' ? '💻' : '📱'}
                </div>
                <div className="device-details">
                  <div className="device-name">{device.name}</div>
                  <div className="device-type">{device.type}</div>
                </div>
              </div>
              <div className="device-status">
                <span className={`status-badge ${getStatusClass(device.status)}`}>
                  {getStatusIcon(device.status)} {device.status === 'synced' ? 'Synced' : device.status}
                </span>
                <div className="device-last-sync">{device.lastSync}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sync Settings */}
      <section className="sync-section">
        <h3 className="section-title">Sync Settings</h3>
        <div className="sync-settings">
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Automatic Sync</div>
              <div className="setting-description">
                Automatically sync your data when changes are made
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="autoSync"
                checked={syncSettings.autoSync}
                onChange={handleSettingChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Sync on Mobile Data</div>
              <div className="setting-description">
                Allow syncing when using mobile data connection
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                name="syncOnMobile"
                checked={syncSettings.syncOnMobile}
                onChange={handleSettingChange}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Conflict Resolution</div>
              <div className="setting-description">How to handle sync conflicts</div>
            </div>
            <select className="setting-select">
              <option>Keep newest version</option>
              <option>Keep both versions</option>
              <option>Ask me every time</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Sync Interval</div>
              <div className="setting-description">How often to check for updates</div>
            </div>
            <select className="setting-select">
              <option>Every 5 minutes</option>
              <option>Every 15 minutes</option>
              <option>Every 30 minutes</option>
              <option>Every hour</option>
            </select>
          </div>
        </div>
      </section>

      {/* Recent Sync Activity */}
      <section className="sync-section">
        <h3 className="section-title">Recent Sync Activity</h3>
        <div className="activity-list">
          {syncActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">🔄</div>
              <div className="activity-details">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-action">{activity.action}</div>
                <div className="activity-device">Device: {activity.device}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sync;