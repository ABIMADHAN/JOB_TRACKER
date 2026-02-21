import {configureStore} from "@reduxjs/toolkit"
import CreatesliceReducer from "./Createslice";
export const store=configureStore({
    reducer:{
        jobs:CreatesliceReducer
    }
})


