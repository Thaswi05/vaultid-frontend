import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FIELD_OPTIONS = [
  { key: 'canSeeName', label: 'Name' },
  { key: 'canSeeEmail', label: 'Email' },
  { key: 'canSeePhone', label: 'Phone' },
  { key: 'canSeeDob', label: 'DOB' },
  { key: 'canSeeAddress', label: 'Address' },
]

function Dashboard() {
  const navigate = useNavigate()
  const [vaultId, setVaultId] = useState('')
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState('')

  // form state for granting a brand new website
  const [newWebsiteId, setNewWebsiteId] = useState('')
  const [newFields, setNewFields] = useState({})
  const [granting, setGranting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedVaultId = localStorage.getItem('vaultId')

    if (!token) {
      navigate('/login')
      return
    }

    setVaultId(storedVaultId)
    fetchPermissions(token)
  }, [navigate])

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

  // Toggle a checkbox on an EXISTING permission card (before saving)
  const toggleExistingField = (permId, fieldKey) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permId ? { ...p, [fieldKey]: !p[fieldKey] } : p
      )
    )
  }

  // Save updated permissions for an existing website
  const savePermission = async (perm) => {
    const token = localStorage.getItem('token')
    setSavingId(perm.id)
    setMessage('')
    try {
      await axios.post(
        'https://vaultid-backend.onrender.com/api/permissions/grant',
        {
          websiteId: perm.websiteId,
          canSeeName: perm.canSeeName,
          canSeeEmail: perm.canSeeEmail,
          canSeePhone: perm.canSeePhone,
          canSeeDob: perm.canSeeDob,
          canSeeAddress: perm.canSeeAddress,
        },
        { headers: { authorization: token } }
      )
      setMessage(`Updated permissions for ${perm.website.name}`)
    } catch (err) {
      console.error(err)
      setMessage('Failed to update permissions.')
    }
    setSavingId(null)
  }

  // Revoke ALL access for a website (sets every field to false)
  const revokeAll = async (perm) => {
    const token = localStorage.getItem('token')
    setSavingId(perm.id)
    setMessage('')
    try {
      await axios.post(
        'https://vaultid-backend.onrender.com/api/permissions/grant',
        {
          websiteId: perm.websiteId,
          canSeeName: false,
          canSeeEmail: false,
          canSeePhone: false,
          canSeeDob: false,
          canSeeAddress: false,
        },
        { headers: { authorization: token } }
      )
      setPermissions(prev =>
        prev.map(p =>
          p.id === perm.id
            ? { ...p, canSeeName: false, canSeeEmail: false, canSeePhone: false, canSeeDob: false, canSeeAddress: false }
            : p
        )
      )
      setMessage(`Revoked all access for ${perm.website.name}`)
    } catch (err) {
      console.error(err)
      setMessage('Failed to revoke access.')
    }
    setSavingId(null)
  }

  // Toggle checkbox in the "grant new website" form
  const toggleNewField = (fieldKey) => {
    setNewFields(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }))
  }

  // Grant a brand-new website access
  const grantNewWebsite = async () => {
    if (!newWebsiteId) {
      setMessage('Enter a Website ID first.')
      return
    }
    const token = localStorage.getItem('token')
    setGranting(true)
    setMessage('')
    try {
      await axios.post(
        'https://vaultid-backend.onrender.com/api/permissions/grant',
        {
          websiteId: Number(newWebsiteId),
          canSeeName: !!newFields.canSeeName,
          canSeeEmail: !!newFields.canSeeEmail,
          canSeePhone: !!newFields.canSeePhone,
          canSeeDob: !!newFields.canSeeDob,
          canSeeAddress: !!newFields.canSeeAddress,
        },
        { headers: { authorization: token } }
      )
      setMessage('Permission granted!')
      setNewWebsiteId('')
      setNewFields({})
      fetchPermissions(token)
    } catch (err) {
      console.error(err)
      setMessage('Failed to grant permission. Check the Website ID.')
    }
    setGranting(false)
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

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Websites with Access</h3>
          {loading ? (
            <p style={{color: '#666'}}>Loading...</p>
          ) : permissions.length === 0 ? (
            <p style={{color: '#666'}}>No websites have access yet.</p>
          ) : (
            permissions.map(p => (
              <div key={p.id} style={styles.permissionCard}>
                <h4 style={{color: 'white', margin: '0 0 12px 0'}}>{p.website.name}</h4>
                <div style={styles.checkboxRow}>
                  {FIELD_OPTIONS.map(opt => (
                    <label key={opt.key} style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={!!p[opt.key]}
                        onChange={() => toggleExistingField(p.id, opt.key)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.saveBtn}
                    onClick={() => savePermission(p)}
                    disabled={savingId === p.id}
                  >
                    {savingId === p.id ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    style={styles.revokeBtn}
                    onClick={() => revokeAll(p)}
                    disabled={savingId === p.id}
                  >
                    Revoke All
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Grant a New Website Access</h3>
          <p style={{color: '#666', fontSize: '13px', marginTop: '-10px'}}>
            Enter the Website ID given to you by the site (ask their support/admin for it).
          </p>
          <input
            type="text"
            placeholder="Website ID (e.g. 2)"
            value={newWebsiteId}
            onChange={(e) => setNewWebsiteId(e.target.value)}
            style={styles.input}
          />
          <div style={styles.checkboxRow}>
            {FIELD_OPTIONS.map(opt => (
              <label key={opt.key} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={!!newFields[opt.key]}
                  onChange={() => toggleNewField(opt.key)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <button
            style={styles.grantBtn}
            onClick={grantNewWebsite}
            disabled={granting}
          >
            {granting ? 'Granting...' : 'Grant Access'}
          </button>
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
  message: {
    backgroundColor: '#1e293b',
    color: '#93c5fd',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  section: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '30px',
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
  checkboxRow: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '14px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#ccc',
    fontSize: '14px',
    cursor: 'pointer',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  revokeBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #7f1d1d',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  grantBtn: {
    padding: '10px 20px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: '8px',
    color: 'white',
    marginBottom: '16px',
    fontSize: '14px',
  },
}

export default Dashboard