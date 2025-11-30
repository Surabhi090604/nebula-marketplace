import { useEffect, useState } from 'react'

export default function Status() {
  const [status, setStatus] = useState('checking...')
  const [details, setDetails] = useState('')

  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/init-db', { method: 'POST' })
        const data = await res.json()

        if (res.ok) {
          setStatus('✅ Database is ready!')
        } else {
          setStatus('❌ Database not initialized')
          setDetails(data.message || data.error)
        }
      } catch (err) {
        setStatus('⚠️ Connection error')
        setDetails(err.message)
      }
    }

    checkSetup()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>System Status</h2>
      <p><strong>Database Status:</strong> {status}</p>
      {details && (
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginTop: '12px' }}>
          <p>{details}</p>
        </div>
      )}
      <hr />
      <h3>Setup Instructions</h3>
      <ol>
        <li>Open <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
        <li>Go to <strong>SQL Editor</strong></li>
        <li>Create a new query and paste this SQL:
          <pre style={{ background: '#f5f5f5', padding: '12px', overflow: 'auto' }}>
{`create table if not exists profiles (
  id uuid primary key,
  email text,
  name text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid,
  seller_name text,
  seller_phone text,
  name text not null,
  description text,
  price numeric,
  image_path text,
  created_at timestamptz default now()
);`}
          </pre>
        </li>
        <li>Click <strong>Run</strong></li>
        <li>Create storage bucket named <strong>product-images</strong> (make it public)</li>
        <li>Refresh this page to verify</li>
      </ol>
    </div>
  )
}
