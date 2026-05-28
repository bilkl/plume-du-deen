import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

export interface Product {
  id: number;
  cartKey?: string;
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

export type CartItemKey = number | string;

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: CartItemKey }
  | { type: 'UPDATE_QUANTITY'; payload: { id: CartItemKey; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const cartMessage = (english: string, french: string) => {
  if (typeof window !== 'undefined' && localStorage.getItem('plume-du-deen-language') === 'en') {
    return english;
  }
  return french;
};

export const getCartItemKey = (item: Pick<Product, 'id' | 'format' | 'cartKey'>): string =>
  item.cartKey || `${item.id}-${item.format || 'digital'}`;

const getActionKey = (payload: CartItemKey): string => String(payload);

const normalizeItems = (items: CartItem[] = []): CartItem[] =>
  items.map(item => ({
    ...item,
    cartKey: getCartItemKey(item),
  }));

const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const createCartState = (items: CartItem[]): CartState => {
  const normalizedItems = normalizeItems(items);
  return {
    items: normalizedItems,
    total: calculateTotal(normalizedItems),
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const payload = {
        ...action.payload,
        cartKey: getCartItemKey(action.payload),
      };
      const payloadKey = getCartItemKey(payload);
      const existingItem = state.items.find(item => getCartItemKey(item) === payloadKey);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          getCartItemKey(item) === payloadKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const newState = createCartState(updatedItems);
        showSuccessToast(cartMessage(`Quantity updated: ${payload.name}`, `Quantité mise à jour : ${payload.name}`));
        return newState;
      } else {
        const newItem: CartItem = { ...payload, quantity: 1 };
        const newItems = [...state.items, newItem];
        const newState = createCartState(newItems);
        showSuccessToast(cartMessage(`${payload.name} added to cart.`, `${payload.name} ajouté au panier !`));
        return newState;
      }
    }
    case 'REMOVE_ITEM': {
      const actionKey = getActionKey(action.payload);
      const itemToRemove = state.items.find(item => getCartItemKey(item) === actionKey);
      const newItems = state.items.filter(item => getCartItemKey(item) !== actionKey);
      const newState = createCartState(newItems);
      if (itemToRemove) {
        showSuccessToast(cartMessage(`${itemToRemove.name} removed from cart`, `${itemToRemove.name} retiré du panier`));
      }
      return newState;
    }
    case 'UPDATE_QUANTITY': {
      const actionKey = getActionKey(action.payload.id);
      if (action.payload.quantity <= 0) {
        const itemToRemove = state.items.find(item => getCartItemKey(item) === actionKey);
        const newItems = state.items.filter(item => getCartItemKey(item) !== actionKey);
        const newState = createCartState(newItems);
        if (itemToRemove) {
          showSuccessToast(cartMessage(`${itemToRemove.name} removed from cart`, `${itemToRemove.name} retiré du panier`));
        }
        return newState;
      }
      const updatedItems = state.items.map(item =>
        getCartItemKey(item) === actionKey
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newState = createCartState(updatedItems);
      const updatedItem = updatedItems.find(item => getCartItemKey(item) === actionKey);
      if (updatedItem) {
        showSuccessToast(cartMessage(`Quantity updated: ${updatedItem.name} (${action.payload.quantity})`, `Quantité mise à jour : ${updatedItem.name} (${action.payload.quantity})`));
      }
      return newState;
    }
    case 'CLEAR_CART':
      showSuccessToast(cartMessage('Cart cleared', 'Panier vidé'));
      return { items: [], total: 0 };
    case 'LOAD_CART':
      return createCartState(action.payload.items || []);
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
