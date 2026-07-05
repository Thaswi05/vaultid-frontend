import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [vaultId, setVaultId] = useState('')
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedVaultId = localStorage.getItem('vaultId')

    if (!token) {
      navigate('/login')
      return
    }

    setVaultId(storedVaultId)
    fetchPermissions(token)
  }, [])

  const fetchPermissions = async (token) => {
    try {
      const res = await axios.get('https://vaultid-backend.onrender.com/api/permissions/my-permissions', {
        headers: { authorization: token }
      })
      setPermissions(res.data.permissions)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('vaultId')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>VaultID</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.content}>
        <div style={styles.vaultCard}>
          <p style={styles.label}>Your VaultID</p>
          <h2 style={styles.vaultId}>{vaultId}</h2>
          <p style={styles.hint}>Share this ID instead of filling forms</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Websites with Access</h3>
          {loading ? (
            <p style={{color: '#666'}}>Loading...</p>
          ) : permissions.length === 0 ? (
            <p style={{color: '#666'}}>No websites have access yet.</p>
          ) : (
            permissions.map(p => (
              <div key={p.id} style={styles.permissionCard}>
                <h4 style={{color: 'white', margin: '0 0 8px 0'}}>{p.website.name}</h4>
                <div style={styles.tags}>
                  {p.canSeeName && <span style={styles.tag}>Name</span>}
                  {p.canSeeEmail && <span style={styles.tag}>Email</span>}
                  {p.canSeePhone && <span style={styles.tag}>Phone</span>}
                  {p.canSeeDob && <span style={styles.tag}>DOB</span>}
                  {p.canSeeAddress && <span style={styles.tag}>Address</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid #222',
  },
  logo: {
    margin: 0,
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '0 20px',
  },
  vaultCard: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '30px',
    border: '1px solid #6366f1',
  },
  label: {
    color: '#666',
    margin: '0 0 8px 0',
  },
  vaultId: {
    color: '#6366f1',
    fontSize: '32px',
    margin: '0 0 8px 0',
    letterSpacing: '2px',
  },
  hint: {
    color: '#444',
    fontSize: '14px',
    margin: 0,
  },
  section: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#aaa',
  },
  permissionCard: {
    backgroundColor: '#2a2a2a',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#6366f1',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
  },
}

export default Dashboard