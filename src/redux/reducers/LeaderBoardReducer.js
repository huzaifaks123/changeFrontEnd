// import redux toolkit to define state at global level
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithToken } from "./UserReducer";

// define initial state
const initialState = {
    leaderBoard: [],
    loading: false,
    error: null
};

// export async thunk api to load data when component mount
export const BoardAsyncThunk = createAsyncThunk(
    'fetchBoard',
    async (_, ThunkApi) => {
        try {
            const response = await fetchWithToken("https://changeapi.onrender.com/api/score");
            ThunkApi.dispatch(setBoard(response));
        } catch (error) {
            console.log("Error while fetching data from API :", error);
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// create slice to set actions and state
const BoardSlice = createSlice({
    name: "Leaderboard",
    initialState,
    reducers: {
        setBoard: (state, action) => {
            state.leaderBoard = action.payload;
            console.log(state.leaderBoard);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(BoardAsyncThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BoardAsyncThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(BoardAsyncThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// export reducer for store
export const BoardReducer = BoardSlice.reducer;

// export actions to use in other component if necessary
export const { setBoard } = BoardSlice.actions;

// export selector to select state defined
export const BoardSelector = (state) => state.BoardReducer;
