import firebase from '../../lib/firebaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check if Firebase is accessible by reading a test path
    const snapshot = await firebase.database.ref('_init_check').get()
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database is ready',
      database: 'Firebase Realtime Database (Mock/Local)'
    })
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      note: 'Using local Firebase mock - this is expected in development'
    })
  }
}
