import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>VaultID</h1>
        <p style={styles.subtitle}>
          One ID for everything. Register once, use everywhere.
        </p>
        <p style={styles.description}>
          Stop filling forms on every website. Get your unique VaultID 
          and share only what you want, with who you want.
        </p>
        <div style={styles.buttons}>
          <button 
            style={styles.primaryBtn}
            onClick={() => navigate('/register')}
          >
            Get Your VaultID
          </button>
          <button 
            style={styles.secondaryBtn}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.feature}>
          <h3>🔒 Private</h3>
          <p>You control who sees what. Hide your phone, show your name.</p>
        </div>
        <div style={styles.feature}>
          <h3>⚡ Fast</h3>
          <p>No more filling forms. Just enter your VaultID.</p>
        </div>
        <div style={styles.feature}>
          <h3>🌐 Universal</h3>
          <p>Works on any website that supports VaultID.</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '72px',
    fontWeight: 'bold',
    margin: '0',
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '24px',
    color: '#a0a0a0',
    margin: '20px 0',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
  buttons: {
    display: 'flex',
    gap: '20px',
    marginTop: '40px',
  },
  primaryBtn: {
    padding: '15px 30px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '15px 30px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    padding: '60px 20px',
    flexWrap: 'wrap',
  },
  feature: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    width: '250px',
    textAlign: 'center',
  },
}

export default Home