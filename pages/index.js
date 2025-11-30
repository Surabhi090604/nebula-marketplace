import { useEffect, useState } from 'react'
import firebase from '../lib/firebaseClient'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

export default function Home() {
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const snapshot = await firebase.database.ref('products').get()
      const data = snapshot.val() || []

      // Convert object to array if needed
      const productsArray = Array.isArray(data) ? data : Object.values(data || {})

      setProducts(productsArray)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '2rem' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '4rem' }}>✨ Nebula</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '1rem', color: 'var(--primary-light)' }}>Where stars align for your shopping desires.</p>
        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>"Whoever said money can't buy happiness simply didn't know where to go shopping." — Bo Derek</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading"></div>
          <p style={{ marginTop: '1.5rem', color: 'var(--gray-500)' }}>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--glass-bg)', borderRadius: '1.5rem', backdropFilter: 'var(--glass-blur)' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)' }}>No products yet. Be the first to list one! 🚀</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      <div style={{ marginTop: '6rem', marginBottom: '4rem', textAlign: 'center', background: 'var(--glass-bg)', padding: '4rem 2rem', borderRadius: '2rem', border: '1px solid var(--glass-border)' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Join the Nebula</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--gray-400)' }}>
          Be the first to know about new arrivals, special offers, and cosmic events.
        </p>
        <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="Enter your email address"
            style={{
              flex: 1,
              padding: '1rem 1.5rem',
              borderRadius: '1rem',
              border: '1px solid var(--glass-border)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: 'white'
            }}
          />
          <button className="btn-primary" style={{ padding: '1rem 2rem' }}>Subscribe</button>
        </div>
      </div>
    </div>
  )
}
