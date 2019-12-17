import { combineReducers } from 'redux';

import {categories} from "./CategoryReducers";
import {user} from '../Reducers/UserReducers'
import {notification} from "./NotificationReducers";
import {books} from "./BookReducers";

export default combineReducers({
    categories,
    user,
    notification,
    books
});