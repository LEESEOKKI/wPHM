import { combineReducers, configureStore} from '@reduxjs/toolkit'
import Reducer from './reducer/Reducer'
import authReducer from './reducer/authReducer'
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  red: Reducer,
  auth :authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),

})

export const persistor = persistStore(store);
export default store
