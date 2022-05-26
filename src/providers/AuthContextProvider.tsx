import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as API from '@/api/API';

type User = {
  email: string;
  name: string;
} | null;
type AuthState = {
  authenticated: boolean;
  user: User;
  loading: boolean;
};
type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'POPULATE'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'STOP_LOADING' };
type Dispatch = React.Dispatch<Action>;

const StateContext = createContext<AuthState>({
  authenticated: false,
  user: null,
  loading: true,
});
const DispatchContext = createContext<any>(null);

const reducer = (state: AuthState, action: Action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'POPULATE':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error('Unknown action type');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore 
  const [state, dispatch]: any = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token === null || token === undefined) {
          return;
        }
        const res: any = await API.GetAPI(API.GetAPIHost('/api/user/get'), {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        });

        const user: User = {
          email: res.data.email,
          name: res.data.username
        };

        dispatch({ type: 'LOGIN', payload: user });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        localStorage.removeItem('token');
      } finally {
        dispatch({ type: 'STOP_LOADING' });
      }
    };

    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch: () => Dispatch = () =>
  useContext(DispatchContext);