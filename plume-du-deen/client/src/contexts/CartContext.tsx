import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  format?: 'digital' | 'paper';
  digitalPrice?: number;
  paperPrice?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newState = {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        showSuccessToast(`Quantité mise à jour : ${action.payload.name}`);
        return newState;
      } else {
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        const newItems = [...state.items, newItem];
        const newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        showSuccessToast(`${action.payload.name} ajouté au panier !`);
        return newState;
      }
    }
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      if (itemToRemove) {
        showSuccessToast(`${itemToRemove.name} retiré du panier`);
      }
      return newState;
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const itemToRemove = state.items.find(item => item.id === action.payload.id);
        const newItems = state.items.filter(item => item.id !== action.payload.id);
        const newState = {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        if (itemToRemove) {
          showSuccessToast(`${itemToRemove.name} retiré du panier`);
        }
        return newState;
      }
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newState = {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      const updatedItem = updatedItems.find(item => item.id === action.payload.id);
      if (updatedItem) {
        showSuccessToast(`Quantité mise à jour : ${updatedItem.name} (${action.payload.quantity})`);
      }
      return newState;
    }
    case 'CLEAR_CART':
      showSuccessToast('Panier vidé');
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('plume-du-deen-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('plume-du-deen-cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};