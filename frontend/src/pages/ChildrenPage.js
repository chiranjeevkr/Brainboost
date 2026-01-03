import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    age: '',
    gender: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingChild, setEditingChild] = useState(null);
  const [editData, setEditData] = useState({ name: '', age: '', gender: '' });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/children');
      setChildren(response.data);
    } catch (error) {
      setError('Failed to fetch children');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const startEdit = (child) => {
    setEditingChild(child._id);
    setEditData({ name: child.name, age: child.age, gender: child.gender || '' });
  };

  const handleUpdateChild = async (childId) => {
    try {
      await axios.put(`/api/children/${childId}`, editData);
      setMessage('Child profile updated successfully!');
      setEditingChild(null);
      fetchChildren();
    } catch (error) {
      setError('Failed to update child profile');
    }
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/children/create', formData);
      setMessage('Child account created successfully!');
      setFormData({ name: '', username: '', password: '', age: '', gender: '' });
      setShowCreateForm(false);
      fetchChildren();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create child account');
    }
  };

  const handleDeleteChild = async (childId) => {
    if (captcha !== 'DELETE') {
      setError('Please type DELETE in captcha field');
      return;
    }
    try {
      await axios.delete(`/api/children/${childId}`, { data: { captcha } });
      setMessage('Child account deleted successfully!');
      setCaptcha('');
      fetchChildren();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete child account');
    }
  };

  const handlePauseChild = async (childId, isPaused) => {
    if (captcha !== 'PAUSE') {
      setError('Please type PAUSE in captcha field');
      return;
    }
    try {
      await axios.put(`/api/children/${childId}/status`, { captcha, isPaused });
      setMessage(`Child account ${isPaused ? 'paused' : 'activated'} successfully!`);
      setCaptcha('');
      fetchChildren();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update child account');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Manage Children Accounts</h2>
        
        {message && <div style={{ color: 'green', marginBottom: '20px' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px'
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create Child Account'}
        </button>

        {showCreateForm && (
          <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
            <h3>Create Child Account</h3>
            <form onSubmit={handleCreateChild}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px'
                }}
              >
                Create Account
              </button>
            </form>
          </div>
        )}

        <div>
          <h3>Your Children</h3>
          {children.length === 0 ? (
            <p>No child accounts created yet.</p>
          ) : (
            children.map(child => (
              <div key={child._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
                {editingChild === child._id ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      onClick={() => handleUpdateChild(child._id)}
                      style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', marginRight: '10px' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingChild(null)}
                      style={{ padding: '5px 10px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '3px' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h4>{child.name} (@{child.username})</h4>
                    <p>Age: {child.age} | Gender: {child.gender || 'Not specified'}</p>
                    <p>Status: {child.isPaused ? 'Paused' : 'Active'}</p>
                    
                    <button
                      onClick={() => window.location.href = `/child-performance/${child._id}`}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        marginRight: '10px',
                        marginBottom: '10px'
                      }}
                    >
                      View Performance
                    </button>
                    
                    <button
                      onClick={() => startEdit(child)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        marginRight: '10px',
                        marginBottom: '10px'
                      }}
                    >
                      Edit Profile
                    </button>
                    
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="Type captcha here"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        style={{ padding: '5px', marginRight: '10px' }}
                      />
                      
                      <button
                        onClick={() => handlePauseChild(child._id, !child.isPaused)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: child.isPaused ? '#4CAF50' : '#FF9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          marginRight: '10px'
                        }}
                      >
                        {child.isPaused ? 'Activate (PAUSE)' : 'Pause (PAUSE)'}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteChild(child._id)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px'
                        }}
                      >
                        Delete (DELETE)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildrenPage;