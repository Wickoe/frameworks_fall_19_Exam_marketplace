/* Libraries */
import AuthenticationService from "../Services/AuthenticationService";
import UserService from "../Services/UserService";
import {showNotificationAction} from "./NotificationActions";
import {navigate} from "@reach/router";

const authService = new AuthenticationService();
const userService = new UserService();

/* Actions */
const updateUser = (username, token, admin, userId) => ({
    type: "UPDATE_USER",
    username: username,
    token: token,
    admin: admin,
    userId: userId
});

const displayUser =  user => ({
    type: "DISPLAY_USER",
    user: user
});

const displayNotification = (msg, level) => async function (dispath) {
    dispath(showNotificationAction(msg, level, process.env.REACT_APP_DISPLAY_NOTIFICATION_TIMER));
};

const createUserAction = (userCredentials) => async function (dispatch) {
    const createUserResponse = await authService.createAccount(userCredentials);

    if (createUserResponse["error"]) {
        return dispatch(displayNotification(createUserResponse["msg"], 2));
    }

    dispatch(displayNotification(createUserResponse["msg"], 1));
    navigate("/");
};

const loginUserAction = (userCredentials) => async function (dispatch) {
    const userLoginResponse = await authService.authenticateUser(userCredentials);

    if (userLoginResponse["error"]) {
        return dispatch(displayNotification(userLoginResponse["msg"], 2));
    }

    const msg = userLoginResponse["msg"],
        username = userLoginResponse["username"],
        token = userLoginResponse["token"],
        admin = userLoginResponse["admin"],
        userId = userLoginResponse["id"];

    dispatch(displayNotification(msg, 1));
    dispatch(updateUser(username, token, admin, userId));

    navigate(`/user/${username}`);
};

const logoutUserAction = _ => function (dispatch) {
    authService.logoutUser();

    dispatch(displayNotification("User logged out!", 1));
    dispatch(updateUser(undefined, undefined));

    navigate("/");
};

const loadUserCredentials = _ => function (dispatch) {
    const userCredentials = authService.loadUserCredentials();

    dispatch(updateUser(userCredentials["username"], userCredentials["token"], userCredentials["admin"]));
};

const loadUserByUsername = username => async function(dispatch) {
    const userResponse = await userService.loadUserByUsername(username);

    if(userResponse["error"]) {
        dispatch(displayNotification(userResponse["msg"], 2));
        return dispatch(displayUser({}));
    }

    dispatch(displayUser(userResponse["user"]));
};

/* Export */
export {createUserAction, loginUserAction, logoutUserAction, loadUserCredentials, loadUserByUsername}