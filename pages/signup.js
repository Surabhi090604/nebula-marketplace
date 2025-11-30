import { useState } from 'react'
import firebase from '../lib/firebaseClient'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSignup(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create user with Firebase Auth
      const { user } = await firebase.auth.createUserWithEmailAndPassword(email, password)

      // Store user profile in Firebase Realtime Database
      await firebase.database.ref(`users/${user.uid}`).set({
        uid: user.uid,
        name,
        phone,
        email,
        createdAt: new Date().toISOString()
      })

      setLoading(false)
      alert('Sign up successful! You can now login.')
      router.push('/login')
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSignup} className="form">
          <div>
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div>
            <label>Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}
