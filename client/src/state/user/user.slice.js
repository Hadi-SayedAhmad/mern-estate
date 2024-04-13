import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentUser: localStorage.getItem("currentUser")? JSON.parse(localStorage.getItem("currentUser")) : null,
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
            localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
            state.error = null,
            state.loading = false
        },
        signInFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            localStorage.setItem("currentUser", JSON.stringify(null));
            state.currentUser = null
            state.loading = false
            state.error = false
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
            
        },
        deleteUserStart: (state) => {
            state.loading = true
        },
        deleteUserSuccess: (state) => {
            localStorage.setItem("currentUser", JSON.stringify(null));
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutStart: (state) => {
            state.loading = true
            
        },
        signOutSuccess: (state) => {
            localStorage.setItem("currentUser", JSON.stringify(null));
            state.currentUser = null
            state.loading = false
            state.error = false
        },
        signOutFailure: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const { signOutFailure, signOutStart, signOutSuccess ,signInFailure, signInStart, signInSuccess, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess} = userSlice.actions;
export default userSlice.reducer;