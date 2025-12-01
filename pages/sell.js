import { useEffect, useState } from 'react'
import firebase from '../lib/firebaseClient'
import { useRouter } from 'next/router'

export default function Sell({ session }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!session) {
      setError('You must be logged in')
      setLoading(false)
      router.push('/login')
      return
    }

    // Get seller profile from database
    let sellerName = 'Anonymous'
    let sellerPhone = 'N/A'
    try {
      const snapshot = await firebase.database.ref(`users/${session.uid}`).get()
      const userData = snapshot.val()
      if (userData) {
        sellerName = userData.name || 'Anonymous'
        sellerPhone = userData.phone || 'N/A'
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }

    // Handle image upload
    let imageUrl = 'https://via.placeholder.com/300x300?text=Product+Image'
    if (file) {
      try {
        const reader = new FileReader()
        const imageDataPromise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
        imageUrl = await imageDataPromise
      } catch (err) {
        console.error('Error processing image:', err)
      }
    }

    // Create product object
    const product = {
      id: `prod_${Date.now()}`,
      name,
      price: parseFloat(price),
      description,
      sellerId: session.uid,
      sellerName,
      sellerPhone,
      imageUrl,
      createdAt: new Date().toISOString()
    }

    try {
      // Push to Firebase Realtime Database
      console.log('💾 Saving product:', product)
      const newRef = await firebase.database.ref('products').push(product)
      console.log('✅ Product saved with key:', newRef.key)

      setLoading(false)
      alert('Product listed successfully!')
      // Add timestamp to force page refresh
      router.push(`/?t=${Date.now()}`)
    } catch (err) {
      console.error('❌ Error creating product:', err)
      setError('Error creating product: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '2rem' }}>📦 List a New Product</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form">
          <div>
            <label>Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Vintage Lamp" required />
          </div>
          <div>
            <label>Price ($)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99.99" required />
          </div>
          <div>
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell buyers about your product..." />
          </div>
          <div>
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            {file && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>✓ {file.name}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Listing Product...' : 'List Product'}
          </button>
        </form>
      </div>
    </div>
  )
}
