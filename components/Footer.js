import { useRouter } from 'next/router'

export default function Footer() {
    const router = useRouter()

    return (
        <footer style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--glass-border)',
            padding: '4rem 0 2rem',
            marginTop: 'auto',
            color: 'white'
        }}>
            <div className="container">
                <div className="grid" style={{ marginTop: 0, gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    {/* Brand */}
                    <div>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #818cf8, #f472b6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Nebula</h2>
                        <p style={{ opacity: 0.7, maxWidth: '300px' }}>
                            Where stars align for your shopping desires. Experience the future of commerce today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>Explore</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <a onClick={() => router.push('/')} style={{ cursor: 'pointer', opacity: 0.8, color: 'white' }}>Home</a>
                            <a onClick={() => router.push('/sell')} style={{ cursor: 'pointer', opacity: 0.8, color: 'white' }}>Sell Product</a>
                            <a onClick={() => router.push('/cart')} style={{ cursor: 'pointer', opacity: 0.8, color: 'white' }}>My Cart</a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>Support</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Help Center</span>
                            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Terms of Service</span>
                            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Privacy Policy</span>
                            <span style={{ opacity: 0.8, cursor: 'pointer' }}>Contact Us</span>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white' }}>Stay Updated</h3>
                        <p style={{ opacity: 0.7, marginBottom: '1rem' }}>Subscribe to our newsletter for the latest cosmic deals.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    width: '100%'
                                }}
                            />
                            <button className="btn-primary" style={{ padding: '0.75rem 1rem' }}>→</button>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '4rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    opacity: 0.6,
                    fontSize: '0.9rem'
                }}>
                    © {new Date().getFullYear()} Nebula Marketplace. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
