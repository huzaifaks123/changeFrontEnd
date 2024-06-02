// Import necessary modules from Redux Toolkit
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Import module for handling cookies
import Cookies from 'js-cookie';

// Define initial state for session and error message
const initialState = {
    session: false,
    errorMessage: ""
};

// Define async thunk to check authentication
export const checkAuthAsyncThunk = createAsyncThunk(
    'checkAuth',
    async (_, ThunkApi) => {
        try {
            // Retrieve token from cookies
            const token = Cookies.get('token');
            if (!token) throw new Error('No token found');

            // Validate token with API
            const response = await fetch(`https://changeapi.onrender.com/api/users/validate-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Token validation failed');
            }
            ThunkApi.dispatch(setSession(true));
        } catch (error) {
            console.error('Error during token validation:', error);
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Define async thunk to handle user login
export const loginAsyncThunk = createAsyncThunk(
    'login',
    async (userData, ThunkApi) => {
        try {
            // Send login request to API
            const response = await fetch(`https://changeapi.onrender.com/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                ThunkApi.dispatch(setErrorMessage(errorMessage));
                throw new Error(errorMessage);
            }
            ThunkApi.dispatch(setErrorMessage(""));
            const data = await response.json();
            // Set token in cookies
            Cookies.set('token', data, { expires: 7, sameSite: 'Lax' });
            ThunkApi.dispatch(setSession(true));
        } catch (error) {
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Define async thunk to handle user logout
export const logoutAsyncThunk = createAsyncThunk(
    'logout',
    async (_, ThunkApi) => {
        try {
            const response = await fetch(`https://changeapi.onrender.com/api/users/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            Cookies.remove('token');
            ThunkApi.dispatch(setSession(false));
        } catch (error) {
            console.error('Error during logout:', error);
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Define a function to fetch data with token
export const fetchWithToken = async (url, options = {}) => {
    const token = Cookies.get('token');
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `${token}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

// Define async thunk to handle user registration
export const registerAsyncThunk = createAsyncThunk(
    'register',
    async (userData, ThunkApi) => {
        try {
            // Send registration request to API
            const response = await fetch(`https://changeapi.onrender.com/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                ThunkApi.dispatch(setErrorMessage(errorMessage));
                throw new Error(errorMessage);
            }
            ThunkApi.dispatch(setErrorMessage(""));
        } catch (error) {
            return ThunkApi.rejectWithValue(error);
        }
    }
);

// Create a slice to define actions and state for user
const UserSlice = createSlice({
    name: "LaunchCard",
    // name: "User",
    initialState,
    reducers: {
        // Define actions to set session and error message
        setSession: (state, action) => {
            state.session = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        }
    }
});

// Export reducer for the store
export const UserReducer = UserSlice.reducer;

// Export actions to use in other components if necessary
export const { setSession, setErrorMessage } = UserSlice.actions;

// Export selector to select the defined state for user
export const UserSelector = (state) => state.UserReducer;
