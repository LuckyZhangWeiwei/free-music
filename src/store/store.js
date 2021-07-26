import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import thunk from "redux-thunk";
import { playMode } from "../common/js/config";
import { loadSearch, loadPlay, loadFavorite } from "../common/js/cache";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage: storage,
  stateReconclier: autoMergeLevel2,
  blacklist: [
    "currentIndex",
    "currentSong",
    "isFullScreen",
    "playMode",
    "playingState",
    "singer",
    "sequenceList",
    "playList",
    "disc",
  ],
};

const myPersistReducer = persistReducer(
  persistConfig,
  combineReducers(reducers)
);

const store = createStore(
  myPersistReducer,
  {
    singer: {},
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    currentSong: {},
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite(),
    banners: [],
    hot: [],
    discList: [],
  },
  composeEnhancers(applyMiddleware(thunk))
);

export const persistor = persistStore(store);

export default store;
