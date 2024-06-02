// import redux toolkit to define state at global level
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithToken } from "./UserReducer";

// Define initial state for topics, questions, and score
const initialState = {
    topics: [],
    questions: [],
    score: null
};

// Define async thunks to fetch topics
export const TopicsAsyncThunk = createAsyncThunk(
    'fetchTopics',
    async (_, ThunkApi) => {
        try {
            const data = await fetchWithToken("https://changeapi.onrender.com/api/quiz/topic");
            ThunkApi.dispatch(setTopic(data));
        } catch (error) {
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Define async thunks to fetch questions
export const QuestionsAsyncThunk = createAsyncThunk(
    'fetchQuestions',
    async (selectedTopics, ThunkApi) => {
        try {
            const response = await fetchWithToken(`https://changeapi.onrender.com/api/quiz/questions?topics=${selectedTopics.join(',')}`);
            ThunkApi.dispatch(setQuestions(response));
        } catch (error) {
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Define async thunks to post score
export const ScoreAsyncThunk = createAsyncThunk(
    'postScore',
    async (score, ThunkApi) => {
        try {
            console.log("Current score:", score);
            await fetchWithToken(`https://changeapi.onrender.com/api/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ score })
            });
        } catch (error) {
            return ThunkApi.rejectWithValue(error.message);
        }
    }
);

// Create a slice to define actions and state
const TopicSlice = createSlice({
    name: "Topics",
    initialState,
    reducers: {
        // set actions to perform
        setTopic: (state, action) => {
            state.topics = action.payload;
        },
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        setScore: (state, action) => {
            state.questions = action.payload;
        },
    },
});

// Export reducer for the store
export const TopicReducer = TopicSlice.reducer;

// Export actions to use in other components if necessary
export const { setTopic, setQuestions, setScore } = TopicSlice.actions;

// Export selector to select the defined state
export const TopicSelector = (state) => state.TopicReducer;
