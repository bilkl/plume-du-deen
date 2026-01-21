import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { CartProvider, useCart } from '../contexts/CartContext'

// Test component that uses cart context
function TestCartComponent() {
  const { state, dispatch } = useCart()

  const addItem = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: 1,
        name: 'Test Product',
        price: 10,
        image: '/test.jpg',
        description: 'Test description'
      }
    })
  }

  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <div data-testid="cart-total">{state.total}</div>
      <div data-testid="cart-items-count">{state.items.length}</div>
    </div>
  )
}

describe('Cart Context', () => {
  it('should add item to cart', async () => {
    const user = userEvent.setup()

    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    )

    const addButton = screen.getByText('Add Item')
    await user.click(addButton)

    expect(screen.getByTestId('cart-total')).toHaveTextContent('10')
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1')
  })
})