import { combineReducers } from 'redux';

import {categories} from "./CategoryReducers";
import {user} from '../Reducers/UserReducers'
import {notification} from "./NotificationReducers";

export default combineReducers({
    categories,
    user,
    notification
});