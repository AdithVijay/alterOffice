import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: (() => {
            try {
                const storedUser = localStorage.getItem('key');
                return storedUser ? JSON.parse(storedUser) : null;
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
                return null;
            }
        })(),
    },
    reducers: {
        addUser: (state, action) => {
            state.users = action.payload;
            localStorage.setItem('key', JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.users = null;
            localStorage.removeItem('key');
        }
    }
});

export const { addUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
