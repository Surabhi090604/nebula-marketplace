import { useRouter } from 'next/router'
import { cartStore } from '../lib/cartStore'

export default function ProductModal({ product, onClose }) {
  const router = useRouter()
  const imageUrl = product.imageUrl || product.image_url
  const sellerName = product.sellerName || product.seller_name
  const sellerPhone = product.sellerPhone || product.seller_phone

  const handleBuy = () => {
    cartStore.addToCart(product)
    alert('✓ Added to cart!')
    router.push('/cart')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>✕</button>
        {imageUrl && (
          <img src={imageUrl} alt={product.name} className="modal-image" />
        )}
        <h3>{product.name}</h3>
        <p className="price">${parseFloat(product.price).toFixed(2)}</p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>{product.description || 'No description provided.'}</p>

        <div className="seller-info">
          <h4 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧑</span> Seller Information
          </h4>
          <p><strong>Name:</strong> {sellerName || 'Anonymous Seller'}</p>
          <p><strong>Phone:</strong> <a href={`tel:${sellerPhone}`}>{sellerPhone || 'Not provided'}</a></p>
        </div>

        <button
          className="btn-primary"
          onClick={handleBuy}
          style={{
            width: '100%',
            marginTop: '2rem',
            fontSize: '1.1rem',
            padding: '1rem'
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  )
}
