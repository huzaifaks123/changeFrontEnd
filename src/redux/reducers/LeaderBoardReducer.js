// import redux toolkit to define state at global level
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithToken } from "./UserReducer";

// define initial state
const initialState = {
    leaderBoard : []
};

// export async thunk api to load data when component mount
export const BoardAsyncThunk = createAsyncThunk(
    'fetchBoard',
    async(_,ThunkApi) => {
        try {
            const response = await fetchWithToken("https://changeapi.onrender.com/api/score");
            ThunkApi.dispatch(setBoard(response));
        } catch (error) {
            console.log("Error while fetching data from API :", error);
        }
    }
)

// create slice to set actions and state
const BoardSlice = createSlice({
    name : "Leaderboard",
    initialState,
    reducers : {
        setBoard : (state, action) => {
            state.leaderBoard = action.payload
            console.log(state.leaderBoard);
        },
    }
})

// export reducer for store
export const BoardReducer = BoardSlice.reducer;

// export actions to use in other component if necessory
export const {setBoard} = BoardSlice.actions;

// expotr selector to select state defined
export const BoardSelector = (state) => state.BoardReducer;
