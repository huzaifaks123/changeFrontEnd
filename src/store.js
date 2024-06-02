// import configure toolkit from redux
import {configureStore} from '@reduxjs/toolkit'

// import reducer to make it available at globle level
import { TopicReducer } from './redux/reducers/HomePageReducer'
import { BoardReducer } from './redux/reducers/LeaderBoardReducer'
import { UserReducer } from './redux/reducers/UserReducer'
import { SideMenuReducer } from './redux/reducers/SideMenuReducer'

// export store
export const store = configureStore({
    reducer:{
        TopicReducer,
        BoardReducer,
        UserReducer,
        SideMenuReducer
    }
})