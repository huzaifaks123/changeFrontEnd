// import redux toolkit to define state at global level
import { createSlice } from "@reduxjs/toolkit";

// define initial state
const initialState = {
    active: '/'
};

// create slice to set actions and state
const SideMenuSlice = createSlice({
    name: "LaunchCard",
    initialState,
    reducers: {
        setActive: (state, action) => {
            state.active = action.payload
        },
    }
})

// export reducer for store
export const SideMenuReducer = SideMenuSlice.reducer;

// export actions to use in other component if necessory
export const { setActive } = SideMenuSlice.actions;

// expotr selector to select state defined
export const SideMenuSelector = (state) => state.SideMenuReducer;
