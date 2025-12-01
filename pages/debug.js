import { useEffect, useState } from 'react'
import firebase from '../lib/firebaseClient'

export default function Debug() {
  const [storageData, setStorageData] = useState({})
  const [products, setProducts] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    if (typeof window !== 'undefined') {
      const data = {
        products: localStorage.getItem('marketplace_products'),
        users: localStorage.getItem('marketplace_users'),
        currentUser: localStorage.getItem('marketplace_currentUser'),
        orders: localStorage.getItem('marketplace_orders')
      }
      setStorageData(data)
    }
  }

  const fetchFromFirebase = async () => {
    try {
      const snapshot = await firebase.database.ref('products').get()
      const data = snapshot.val()
      console.log('Firebase products:', data)
      setProducts(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const clearStorage = () => {
    if (confirm('Clear all localStorage?')) {
      localStorage.clear()
      loadData()
      alert('Storage cleared!')
    }
  }

  const addTestProduct = async () => {
    const product = {
      id: `prod_${Date.now()}`,
      name: 'Test Product ' + new Date().toLocaleTimeString(),
      price: 99.99,
      description: 'Debug test product',
      sellerId: 'test123',
      sellerName: 'Test Seller',
      sellerPhone: '1234567890',
      imageUrl: 'https://via.placeholder.com/300',
      createdAt: new Date().toISOString()
    }

    try {
      console.log('Adding product:', product)
      const ref = await firebase.database.ref('products').push(product)
      console.log('Product added with key:', ref.key)
      alert('Product added! Check console and reload page.')
      setTimeout(loadData, 500)
      setTimeout(fetchFromFirebase, 1000)
    } catch (err) {
      console.error('Error adding product:', err)
      alert('Error: ' + err.message)
    }
  }

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>🔧 Debug Page</h1>

      <div style={{ marginBottom: '2rem' }}>
        <button onClick={loadData} className="btn-primary" style={{ marginRight: '1rem' }}>
          Refresh Data
        </button>
        <button onClick={fetchFromFirebase} className="btn-primary" style={{ marginRight: '1rem' }}>
          Fetch from Firebase
        </button>
        <button onClick={addTestProduct} className="btn-primary" style={{ marginRight: '1rem' }}>
          Add Test Product
        </button>
        <button onClick={clearStorage} style={{ background: '#ef4444' }}>
          Clear Storage
        </button>
      </div>

      <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
        <h2>LocalStorage Data</h2>
        {Object.entries(storageData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#60a5fa', fontSize: '1rem' }}>{key}:</h3>
            <pre style={{
              background: '#0f172a',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              fontSize: '0.85rem'
            }}>
              {value || 'null'}
            </pre>
          </div>
        ))}
      </div>

      {products && (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '1rem' }}>
          <h2>Firebase Products</h2>
          <pre style={{
            background: '#0f172a',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            fontSize: '0.85rem'
          }}>
            {JSON.stringify(products, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
