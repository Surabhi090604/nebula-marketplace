import { useEffect, useState } from 'react'
import { cartStore } from '../lib/cartStore'
import { useRouter } from 'next/router'
import firebase from '../lib/firebaseClient'

export default function Cart({ session }) {
  const router = useRouter()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  useEffect(() => {
    setCart(cartStore.getCart())
  }, [])

  const handleRemove = (productId) => {
    const updatedCart = cartStore.removeFromCart(productId)
    setCart(updatedCart)
  }

  const handleQuantityChange = (productId, quantity) => {
    const updatedCart = cartStore.updateQuantity(productId, parseInt(quantity))
    setCart(updatedCart)
  }

  const handleCheckout = async () => {
    if (!session) {
      alert('Please log in to complete your purchase')
      router.push('/login')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }

    setLoading(true)

    try {
      const order = {
        id: `order_${Date.now()}`,
        userId: session.uid,
        items: cart,
        total: cartStore.getTotal(),
        status: 'completed',
        createdAt: new Date().toISOString()
      }

      // Save order to database
      await firebase.database.ref(`orders/${order.id}`).set(order)

      // Clear cart
      cartStore.clearCart()
      setCart([])
      setOrderPlaced(true)

      alert('Order placed successfully! 🎉')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      console.error('Error placing order:', err)
      alert('Error placing order: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const total = cartStore.getTotal()

  return (
    <div className="container">
      <h1 style={{ marginBottom: '2rem', color: 'white', fontSize: '2rem' }}>🛒 Shopping Cart</h1>

      {orderPlaced ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--glass-bg)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          backdropFilter: 'var(--glass-blur)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
          <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--gray-400)' }}>Thank you for your purchase. Redirecting to home page...</p>
        </div>
      ) : cart.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--glass-bg)',
          borderRadius: '1.5rem',
          backdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛍️</div>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-400)', marginBottom: '2rem' }}>
            Discover amazing products and start shopping!
          </p>
          <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '1rem 2rem' }}>
            Explore Products
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            {cart.map((item) => {
              const imageUrl = item.imageUrl || item.image || item.image_url || '/default-product.png'
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    background: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)',
                    borderRadius: '1.5rem',
                    border: '1px solid var(--glass-border)',
                    transition: 'var(--transition)'
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={imageUrl}
                    alt={item.name}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '1rem',
                      border: '1px solid var(--glass-border)'
                    }}
                  />

                  {/* Product Info */}
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.25rem' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                      By <strong style={{ color: 'var(--primary-light)' }}>{item.sellerName || 'Anonymous'}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                      <div className="price" style={{ fontSize: '1.25rem', marginBottom: 0 }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>Qty:</label>
                        <select
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            background: 'rgba(15, 23, 42, 0.6)',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      background: 'rgba(248, 113, 113, 0.2)',
                      color: 'var(--danger)',
                      border: '1px solid rgba(248, 113, 113, 0.3)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--danger)'
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(248, 113, 113, 0.2)'
                      e.target.style.color = 'var(--danger)'
                    }}
                  >
                    Remove
                  </button>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                padding: '2rem',
                borderRadius: '1.5rem',
                border: '1px solid var(--glass-border)'
              }}
            >
              <h3 style={{ marginTop: 0, color: 'white', fontSize: '1.5rem' }}>Order Summary</h3>

              <div style={{ margin: '1.5rem 0', padding: '1.5rem 0', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--gray-400)' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--gray-400)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'white' }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--gray-400)' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--success)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--gray-400)' }}>
                  <span>Tax</span>
                  <span style={{ color: 'white' }}>Calculated at checkout</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(129, 140, 248, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(129, 140, 248, 0.2)'
              }}>
                <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'white' }}>Total:</span>
                <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary-light)' }}>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '0.75rem' }}
              >
                {loading ? 'Processing...' : '💳 Checkout'}
              </button>

              <button
                onClick={() => router.push('/')}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem'
                }}
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🔒</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Secure Payment</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🚚</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Free Shipping</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>↩️</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Easy Returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
