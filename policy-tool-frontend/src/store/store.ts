import { configureStore } from '@reduxjs/toolkit'
import { reducer } from './policy/slice'

export const store = configureStore({ reducer })
