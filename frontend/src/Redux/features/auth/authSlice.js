import { createSlice } from "@reduxjs/toolkit";

// Check expiration
const expirationTime = localStorage.getItem("expirationTime");
if (expirationTime && new Date().getTime() > expirationTime) {
    localStorage.clear();
}

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredientials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));

            // Set expiration: 30 days from now
            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expirationTime", expirationTime);
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("expirationTime");
        },
    },
});

export const { setCredientials, logout } = authSlice.actions;

export default authSlice.reducer;
