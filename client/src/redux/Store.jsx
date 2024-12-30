import { configureStore } from '@reduxjs/toolkit';
import usereducer from './UserSlice'
const store = configureStore({
    reducer:{
        user:usereducer,
    }
})
export default store