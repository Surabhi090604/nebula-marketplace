import '../styles/globals.css'
import { useRouter } from 'next/router'
import firebase from '../lib/firebaseClient'
import { useEffect, useState } from 'react'
import { cartStore } from '../lib/cartStore'
import Chatbot from '../components/Chatbot'

function Header({ session, cartCount }) {
  const router = useRouter()

  async function handleLogout() {
    await firebase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo" onClick={() => router.push('/')}>Nebula</h1>
        <nav>
          <button onClick={() => router.push('/')}>Home</button>
          <button onClick={() => router.push('/sell')}>Sell</button>
          <button onClick={() => router.push('/cart')} style={{ position: 'relative' }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--secondary)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
          {session ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button className="btn-primary" onClick={() => router.push('/login')}>Login</button>
          )}
        </nav>
      </div>
    </header>
  )
}

import Footer from '../components/Footer'

// ... existing imports

// ... existing Header component

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {
      setSession(user)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // Update cart count
    const count = cartStore.getItemCount()
    setCartCount(count)

    // Check for cart changes periodically
    const interval = setInterval(() => {
      setCartCount(cartStore.getItemCount())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header session={session} cartCount={cartCount} />
      <main className="container" style={{ flex: 1 }}>
        <Component {...pageProps} session={session} />
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}
