import { configureStore } from '@reduxjs/toolkit';
import usereducer from './Userslice'
const store = configureStore({
    reducer:{
        user:usereducer,
    }
})
export default store