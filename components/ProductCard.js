export default function ProductCard({ product, onClick }) {
  const imageUrl = product.image || product.imageUrl || product.image_url

  return (
    <div className="card" onClick={onClick}>
      <img
        src={imageUrl || '/default-product.png'}
        alt={product.name}
        style={{ opacity: imageUrl ? 1 : 0.9 }}
      />
      <div className="card-body">
        <div className="price">${product.price}</div>
        <h3>{product.name}</h3>
        <p>{product.description?.substring(0, 60)}...</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>By {product.sellerName || 'Unknown'}</span>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View</button>
        </div>
      </div>
    </div>
  )
}
