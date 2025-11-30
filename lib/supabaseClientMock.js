// Mock Supabase client for local development/testing
// This bypasses real Supabase calls and allows testing the full app flow

const mockUsers = new Map() // In-memory user store for demo
let currentUser = null // Track currently logged-in user

export const supabase = {
  auth: {
    signUp: async ({ email, password }) => {
      // Simulate signup delay
      await new Promise(r => setTimeout(r, 500))

      if (mockUsers.has(email)) {
        return {
          data: null,
          error: { message: 'User already exists' }
        }
      }

      const userId = 'user_' + Math.random().toString(36).substring(7)
      mockUsers.set(email, { id: userId, password, email })
      currentUser = { id: userId, email }

      return {
        data: {
          user: { id: userId, email }
        },
        error: null
      }
    },

    signInWithPassword: async ({ email, password }) => {
      // Simulate login delay
      await new Promise(r => setTimeout(r, 500))

      const user = mockUsers.get(email)
      if (!user) {
        return {
          data: null,
          error: { message: 'Invalid credentials' }
        }
      }

      if (user.password !== password) {
        return {
          data: null,
          error: { message: 'Invalid credentials' }
        }
      }

      currentUser = { id: user.id, email }

      return {
        data: {
          session: {
            user: { id: user.id, email }
          }
        },
        error: null
      }
    },

    signOut: async () => {
      currentUser = null
      return { error: null }
    },

    getSession: async () => {
      return {
        data: {
          session: currentUser ? { user: currentUser } : null
        }
      }
    },

    getUser: async () => {
      return {
        data: {
          user: currentUser || {
            id: 'mock-user-id',
            email: 'demo@example.com'
          }
        }
      }
    },

    onAuthStateChange: (callback) => {
      // Return proper subscription object
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    }
  },

  from: (table) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({
          data: { name: 'Demo User', phone: '1234567890' },
          error: null
        })
      }),
      order: () => ({
        data: [
          {
            id: 'prod-1',
            name: 'Sample Product',
            price: 99.99,
            seller_name: 'Demo Seller',
            seller_phone: '9876543210',
            description: 'This is a demo product',
            image_path: null
          }
        ],
        error: null
      })
    }),
    insert: async (data) => ({
      data: [{ ...data, id: 'prod_' + Math.random().toString(36).substring(7) }],
      error: null
    })
  }),

  storage: {
    from: (bucket) => ({
      upload: async (path, file) => ({
        data: { path },
        error: null
      }),
      getPublicUrl: (path) => ({
        publicUrl: 'https://via.placeholder.com/300x300?text=Demo+Product'
      })
    }),
    listBuckets: async () => ({
      data: [{ name: 'product-images' }],
      error: null
    }),
    createBucket: async (name, opts) => ({
      data: { name },
      error: null
    })
  }
}
