import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentUser: localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")) : null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem("user", JSON.stringify(state.currentUser));
            state.error = null,
            state.loading = false
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
    }
})

export const {signInFailure, signInStart, signInSuccess} = userSlice.actions;
export default userSlice.reducer;