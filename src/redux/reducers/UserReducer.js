import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
    session: false,
    errorMessage: "",
    loading: false // Add loading state
};

export const checkAuthAsyncThunk = createAsyncThunk(
    'checkAuth',
    async (_, ThunkApi) => {
        try {
            const token = Cookies.get('token');
            if (!token) throw new Error();

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

export const loginAsyncThunk = createAsyncThunk(
    'login',
    async (userData, ThunkApi) => {
        try {
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
            Cookies.set('token', data, { expires: 7, sameSite: 'Lax' });
            ThunkApi.dispatch(setSession(true));
        } catch (error) {
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

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
            return ThunkApi.rejectWithValue("Error");
        }
    }
);

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

export const registerAsyncThunk = createAsyncThunk(
    'register',
    async (userData, ThunkApi) => {
        try {
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
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

const UserSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsyncThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginAsyncThunk.fulfilled, (state) => {
                state.session = true;
                state.errorMessage = "";
                state.loading = false;
            })
            .addCase(loginAsyncThunk.rejected, (state, action) => {
                state.session = false;
                state.errorMessage = action.payload;
                state.loading = false;
            })
            .addCase(registerAsyncThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerAsyncThunk.fulfilled, (state) => {
                state.errorMessage = "";
                state.loading = false;
            })
            .addCase(registerAsyncThunk.rejected, (state, action) => {
                state.errorMessage = action.payload;
                state.loading = false;
            });
    }
});

export const UserReducer = UserSlice.reducer;

export const { setSession, setErrorMessage } = UserSlice.actions;

export const UserSelector = (state) => state.UserReducer;
