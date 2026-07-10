import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', address: '', password: ''
  })
  const [vaultId, setVaultId] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('https://vaultid-backend.https://vaultid-backend-ffdzbudbf8a2ahcs.centralindia-01.azurewebsites.net/api/auth/register', form)
      setVaultId(res.data.vaultId)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  if (vaultId) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <h1 style={{color: '#6366f1'}}>🎉 You're registered!</h1>
          <p style={{color: '#aaa'}}>Your unique VaultID is:</p>
          <div style={styles.vaultIdBox}>{vaultId}</div>
          <p style={{color: '#666', fontSize: '14px'}}>
            Save this ID — you'll use it on any website that supports VaultID
          </p>
          <button style={styles.btn} onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Your VaultID</h2>
        <p style={styles.subtitle}>Register once, use everywhere</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="name" placeholder="Full Name" onChange={handleChange} required />
          <input style={styles.input} name="email" placeholder="Email" type="email" onChange={handleChange} required />
          <input style={styles.input} name="phone" placeholder="Phone Number" onChange={handleChange} />
          <input style={styles.input} name="dob" placeholder="Date of Birth (YYYY-MM-DD)" onChange={handleChange} />
          <input style={styles.input} name="address" placeholder="Address" onChange={handleChange} />
          <input style={styles.input} name="password" placeholder="Password" type="password" onChange={handleChange} required />
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Get My VaultID'}
          </button>
        </form>

        <p style={{color: '#666', textAlign: 'center', marginTop: '20px'}}>
          Already have a VaultID?{' '}
          <span style={{color: '#6366f1', cursor: 'pointer'}} onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    width: '400px',
  },
  successCard: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    width: '400px',
    textAlign: 'center',
    color: 'white',
  },
  title: {
    color: 'white',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#666',
    margin: '0 0 24px 0',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    backgroundColor: '#3a1a1a',
    color: '#f87171',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  vaultIdBox: {
    backgroundColor: '#2a2a2a',
    color: '#6366f1',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '16px 0',
    letterSpacing: '2px',
  },
}

export default Register