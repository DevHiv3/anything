import { configureStore } from "@reduxjs/toolkit";
import reducerSlice from "./slices/slice"

export const store = configureStore({

    reducer: {
        data: reducerSlice
    }
})

