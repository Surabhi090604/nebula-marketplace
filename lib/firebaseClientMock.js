// Mock Firebase client for local development/testing
// This bypasses real Firebase calls and allows testing the full app flow
// Uses localStorage for persistence across browser sessions

const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substring(7)}`

// Initialize storage with localStorage if available
let mockUsers = new Map()
let mockProducts = []
let mockOrders = []
let mockChatHistory = []
let currentUser = null
let authCallbacks = []

// Load data from localStorage on startup
const loadFromStorage = () => {
  if (typeof window === 'undefined') return // Skip on server-side

  try {
    // Load users
    const usersData = localStorage.getItem('marketplace_users')
    if (usersData) {
      const usersArray = JSON.parse(usersData)
      mockUsers = new Map(usersArray)
    }

    // Load products
    const productsData = localStorage.getItem('marketplace_products')
    if (productsData) {
      mockProducts = JSON.parse(productsData)
    }

    // Load orders
    const ordersData = localStorage.getItem('marketplace_orders')
    if (ordersData) {
      mockOrders = JSON.parse(ordersData)
    }

    // Load chat history
    const chatData = localStorage.getItem('marketplace_chatbot')
    if (chatData) {
      mockChatHistory = JSON.parse(chatData)
    }

    // Load current user session
    const currentUserData = localStorage.getItem('marketplace_currentUser')
    if (currentUserData) {
      currentUser = JSON.parse(currentUserData)
    }
  } catch (err) {
    console.error('Error loading from localStorage:', err)
  }
}

// Save data to localStorage
const saveToStorage = () => {
  if (typeof window === 'undefined') return // Skip on server-side

  try {
    // Save users
    localStorage.setItem('marketplace_users', JSON.stringify(Array.from(mockUsers.entries())))

    // Save products
    localStorage.setItem('marketplace_products', JSON.stringify(mockProducts))

    // Save orders
    localStorage.setItem('marketplace_orders', JSON.stringify(mockOrders))

    // Save chat history
    localStorage.setItem('marketplace_chatbot', JSON.stringify(mockChatHistory))

    // Save current user
    localStorage.setItem('marketplace_currentUser', JSON.stringify(currentUser))
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

// Load data on module initialization
loadFromStorage()

// Mock Auth API
const mockAuth = {
  currentUser: null,

  createUserWithEmailAndPassword: async (email, password) => {
    await new Promise(r => setTimeout(r, 500))

    if (mockUsers.has(email)) {
      throw new Error('Email already in use')
    }

    const userId = generateId('user')
    const userData = { id: userId, password, email, name: '', phone: '' }
    mockUsers.set(email, userData)
    currentUser = { uid: userId, email }
    mockAuth.currentUser = currentUser

    saveToStorage()

    // Notify auth state change listeners
    authCallbacks.forEach(cb => cb(currentUser))

    return { user: { uid: userId, email } }
  },

  signInWithEmailAndPassword: async (email, password) => {
    await new Promise(r => setTimeout(r, 500))

    const user = mockUsers.get(email)
    if (!user) {
      throw new Error('User not found')
    }

    if (user.password !== password) {
      throw new Error('Wrong password')
    }

    currentUser = { uid: user.id, email }
    mockAuth.currentUser = currentUser

    saveToStorage()

    // Notify auth state change listeners
    authCallbacks.forEach(cb => cb(currentUser))

    return { user: { uid: user.id, email } }
  },

  signOut: async () => {
    await new Promise(r => setTimeout(r, 300))
    currentUser = null
    mockAuth.currentUser = null

    saveToStorage()

    // Notify auth state change listeners
    authCallbacks.forEach(cb => cb(null))
  },

  onAuthStateChanged: (callback) => {
    // Add callback to list
    authCallbacks.push(callback)

    // Call immediately with current state
    callback(currentUser)

    // Return unsubscribe function
    return () => {
      authCallbacks = authCallbacks.filter(cb => cb !== callback)
    }
  }
}

// Mock Database API
const mockDatabase = {
  ref: (path) => {
    return {
      set: async (data) => {
        await new Promise(r => setTimeout(r, 300))

        // Handle user profile updates
        if (path.startsWith('users/') && currentUser) {
          const userId = path.split('/')[1]
          if (userId === currentUser.uid) {
            const userEmail = Array.from(mockUsers.entries()).find(([_, user]) => user.id === userId)?.[0]
            if (userEmail) {
              const existingUser = mockUsers.get(userEmail)
              mockUsers.set(userEmail, { ...existingUser, ...data })
              saveToStorage()
            }
          }
        }

        // Handle chatbot history saves
        if (path === 'chatbot/history') {
          mockChatHistory = data
          saveToStorage()
        }

        return { error: null }
      },

      get: async () => {
        await new Promise(r => setTimeout(r, 300))
        if (path === 'users/' + (currentUser?.uid || '')) {
          const user = Array.from(mockUsers.values()).find(u => u.id === currentUser?.uid)
          return { val: () => user || null }
        }
        if (path === 'products') {
          return { val: () => mockProducts }
        }
        if (path === 'chatbot/history') {
          return { val: () => mockChatHistory }
        }
        if (path.startsWith('orders/')) {
          const orderId = path.split('/')[1]
          const order = mockOrders.find(o => o.id === orderId)
          return { val: () => order || null }
        }
        return { val: () => null }
      },

      on: (event, callback) => {
        // Simulate real-time updates
        let data = null
        if (path === 'products') {
          data = mockProducts
        }
        setTimeout(() => callback({ val: () => data }), 100)

        return () => {} // unsubscribe function
      },

      push: async (data) => {
        const key = generateId('prod')
        mockProducts.push({ ...data, id: key })
        saveToStorage()
        return { key }
      }
    }
  }
}

// Mock Storage API
const mockStorage = {
  ref: (path) => {
    return {
      putFile: async (file) => {
        await new Promise(r => setTimeout(r, 800))
        return { ref: { fullPath: path } }
      },

      putString: async (data) => {
        await new Promise(r => setTimeout(r, 800))
        return { ref: { fullPath: path } }
      },

      getDownloadURL: async () => {
        return 'https://via.placeholder.com/300x300?text=Product+Image'
      }
    }
  }
}

module.exports = {
  auth: mockAuth,
  database: mockDatabase,
  storage: mockStorage
}
