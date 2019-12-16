/*Libraries */
import UserService from '../Services/UserService';
import AuthenticationService from "../Services/AuthenticationService";
import {showNotificationAction} from "./NotificationActions";
import {navigate} from "@reach/router";

const userService = new UserService();
const authService = new AuthenticationService();

/* Actions */
const updateUser = (username, token) => ({
    type: "UPDATE_USER",
    username: username,
    token: token
});

const createUserAction = (userCredentials) => async function (dispatch) {
    const displayTimer = (process.env.REACT_DISPLAY_NOTIFICATION_TIMER || 2000);

    const createUserResponse = await authService.createAccount(userCredentials);

    if (createUserResponse["error"]) {
        dispatch(showNotificationAction(createUserResponse["msg"], 2, displayTimer));
        return;
    }

    dispatch(showNotificationAction(createUserResponse["msg"], 1, displayTimer));
    setTimeout(navigate("/"), displayTimer);
};

const loginUserAction = (userCredentials) => async function(dispatch) {
    const displayTimer = (process.env.REACT_DISPLAY_NOTIFICATION_TIMER || 2000);

    const userLoginResponse = await authService.authenticateUser(userCredentials);

    if(userLoginResponse["error"]) {
        dispatch(showNotificationAction(userLoginResponse["msg"], 2, displayTimer));
        return;
    }

    const msg = userLoginResponse["msg"],
        username = userLoginResponse["username"],
        token = userLoginResponse["token"];

    dispatch(showNotificationAction(msg, 1, displayTimer));
    dispatch(updateUser(username, token));
    setTimeout(navigate("/"), displayTimer);
};

const logoutUserAction = _ => function (dispatch) {
    const displayTimer = (process.env.REACT_DISPLAY_NOTIFICATION_TIMER || 2000);

    const logoutResponse = authService.logoutUser();

    dispatch(showNotificationAction("User logged out!", 1, displayTimer));
    dispatch(updateUser(undefined, undefined));
    setTimeout(navigate("/"), displayTimer);
};

/* Export */
export {createUserAction, loginUserAction, logoutUserAction}