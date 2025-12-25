import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sarahj',
    email: 'sarah.johnson@example.com',
    bio: 'An enthusiastic reader and movie buff',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    autoSync: false,
    showRecentlyAdded: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Password updated');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Preferences saved:', preferences);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.'
    );
    
    if (confirmed) {
      // Delete account logic
      console.log('Account deleted');
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="settings-content">
      <h1>Profile Settings</h1>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          ✓ Your profile has been updated successfully!
        </div>
      )}

      {/* Profile Info */}
      <section className="settings-section">
        <div className="section-header">
          <div className="profile-avatar">
            <span className="avatar-text">SJ</span>
          </div>
          <div className="profile-info">
            <h2>{profileData.firstName} {profileData.lastName}</h2>
            <p>@{profileData.username} • {profileData.email}</p>
            <button className="btn-change-photo">📷 Change Profile Photo</button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">248</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">42</div>
            <div className="stat-label">Favorites</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Lists</div>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="settings-section">
        <h3 className="section-title">Personal Information</h3>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                placeholder="Sarah"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                placeholder="Johnson"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              placeholder="sarahj"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="sarah.johnson@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              placeholder="Tell us about yourself..."
              rows={3}
            />
            <span className="helper-text">Brief description for your profile</span>
          </div>

          <button type="submit" className="btn-save">
            💾 Save Changes
          </button>
          <button type="button" className="btn-cancel" onClick={() => window.location.reload()}>
            Cancel
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="settings-section">
        <h3 className="section-title">Change Password</h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password *</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password *</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
            />
            <span className="helper-text">
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              required
            />
          </div>

          <button type="submit" className="btn-update-password">
            🔐 Update Password
          </button>
          <button type="button" className="btn-cancel">
            Cancel
          </button>
        </form>
      </section>

      {/* Preferences */}
      <section className="settings-section">
        <h3 className="section-title">Preferences</h3>
        <form onSubmit={handlePreferencesSubmit}>
          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handlePreferenceChange}
              />
              <span>Enable email notifications</span>
            </label>
          </div>

          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="autoSync"
                checked={preferences.autoSync}
                onChange={handlePreferenceChange}
              />
              <span>Automatically sync data across devices</span>
            </label>
          </div>

          <div className="preference-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showRecentlyAdded"
                checked={preferences.showRecentlyAdded}
                onChange={handlePreferenceChange}
              />
              <span>Show recently added items on dashboard</span>
            </label>
          </div>

          <button type="submit" className="btn-save-preferences">
            💾 Save Preferences
          </button>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="settings-section danger-zone">
        <h3 className="section-title danger-title">Danger Zone</h3>
        <div className="danger-content">
          <div className="danger-info">
            <h4>Delete My Account</h4>
            <p>
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
          </div>
          <button className="btn-delete-account" onClick={handleDeleteAccount}>
            🗑️ Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;