import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    age: '',
    phoneNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const isChild = user?.userType === 'child';

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        gender: user.gender || '',
        age: user.age || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setError('');
    } catch (error) {
      setError('Failed to update profile');
      setMessage('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Password changed successfully!');
      setError('');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError('Failed to change password');
      setMessage('');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
        <h2>User Profile</h2>
        
        {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        {/* Profile Information */}
        <div style={{ marginBottom: '40px' }}>
          <h3>Profile Information</h3>
          <form onSubmit={handleProfileSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={isChild}
                style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: isChild ? '#f5f5f5' : 'white' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Gender:</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleProfileChange}
                disabled={isChild}
                style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: isChild ? '#f5f5f5' : 'white' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={profileData.age}
                onChange={handleProfileChange}
                disabled={isChild}
                style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: isChild ? '#f5f5f5' : 'white' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>{isChild ? 'Username:' : 'Email:'}:</label>
              <input
                type={isChild ? 'text' : 'email'}
                value={isChild ? user?.username : user?.email || ''}
                disabled
                style={{ width: '100%', padding: '10px', marginTop: '5px', backgroundColor: '#f5f5f5' }}
              />
            </div>

            {!isChild && (
              <div style={{ marginBottom: '15px' }}>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                />
              </div>
            )}

            {!isChild && (
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Update Profile
              </button>
            )}
          </form>
        </div>

        {/* Change Password - Only for non-children */}
        {!isChild && (
          <div>
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Change Password
              </button>
            </form>
          </div>
        )}
        
        {isChild && (
          <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <p style={{ color: '#666', fontSize: '16px' }}>Only your parent can update your profile information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;