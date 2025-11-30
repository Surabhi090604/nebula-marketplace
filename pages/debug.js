import { useEffect, useState } from 'react'

export default function Debug() {
  const [config, setConfig] = useState(null)
  const [test, setTest] = useState(null)

  useEffect(() => {
    setConfig({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'MISSING'
    })

    // Test Supabase connectivity from browser
    ;(async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const res = await fetch(`${url}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': key
          },
          body: JSON.stringify({
            email: 'test+debug@example.com',
            password: 'DebugPassword123!'
          })
        })

        const data = await res.json()
        setTest({
          status: res.status,
          ok: res.ok,
          data: data
        })
      } catch (err) {
        setTest({
          error: err.message
        })
      }
    })()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', fontFamily: 'monospace' }}>
      <h2>Debug: Supabase Configuration</h2>
      
      <h3>Environment Variables</h3>
      <pre style={{ background: '#f5f5f5', padding: '12px', overflow: 'auto' }}>
        {JSON.stringify(config, null, 2)}
      </pre>

      <h3>Signup Endpoint Test</h3>
      <pre style={{ background: '#f5f5f5', padding: '12px', overflow: 'auto' }}>
        {test ? JSON.stringify(test, null, 2) : 'Testing...'}
      </pre>

      <h3>Troubleshooting</h3>
      <ul>
        <li><strong>URL is missing?</strong> Add NEXT_PUBLIC_SUPABASE_URL to .env.local</li>
        <li><strong>Key is missing?</strong> Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local</li>
        <li><strong>Signup error?</strong> Check the response above for the exact error</li>
      </ul>

      <p><a href="/signup">← Back to Signup</a></p>
    </div>
  )
}
