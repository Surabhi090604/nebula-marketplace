// Simple cart store using localStorage
// This manages shopping cart state across the app

const CART_KEY = 'marketplace_cart'

export const cartStore = {
  // Get all cart items
  getCart: () => {
    if (typeof window === 'undefined') return []
    try {
      const cart = localStorage.getItem(CART_KEY)
      return cart ? JSON.parse(cart) : []
    } catch (err) {
      console.error('Error loading cart:', err)
      return []
    }
  },

  // Add item to cart
  addToCart: (product) => {
    const cart = cartStore.getCart()
    const existingItem = cart.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        ...product,
        quantity: 1
      })
    }

    cartStore.saveCart(cart)
    return cart
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    let cart = cartStore.getCart()
    cart = cart.filter(item => item.id !== productId)
    cartStore.saveCart(cart)
    return cart
  },

  // Update quantity
  updateQuantity: (productId, quantity) => {
    const cart = cartStore.getCart()
    const item = cart.find(item => item.id === productId)

    if (item) {
      if (quantity <= 0) {
        return cartStore.removeFromCart(productId)
      }
      item.quantity = quantity
    }

    cartStore.saveCart(cart)
    return cart
  },

  // Clear entire cart
  clearCart: () => {
    if (typeof window === 'undefined') return []
    localStorage.setItem(CART_KEY, JSON.stringify([]))
    return []
  },

  // Get cart total
  getTotal: () => {
    const cart = cartStore.getCart()
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
  },

  // Get item count
  getItemCount: () => {
    const cart = cartStore.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  },

  // Save cart to localStorage
  saveCart: (cart) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch (err) {
      console.error('Error saving cart:', err)
    }
  }
}
