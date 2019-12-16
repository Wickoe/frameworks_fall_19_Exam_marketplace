import { combineReducers } from 'redux';

import {categories} from "./CategoryReducers";
import {users} from '../Reducers/UserReducers'
import {notification} from "./NotificationReducers";

export default combineReducers({
    categories,
    users,
    notification
});