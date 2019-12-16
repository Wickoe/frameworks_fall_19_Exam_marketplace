const showNotification = (msg) => ({
    type: 'DISPLAY_NOTIFICATION',
    msg: msg
});

const showNotificationAction = (msg, displayTimer) => async function(dispatch) {
    dispatch(showNotification(msg));

    setTimeout(hideNotificationAction(), displayTimer)
};

const hideNotification = _ => ({
    type: 'HIDE_NOTIFICATION'
});

const hideNotificationAction = _ => function (dispatch) {
    dispatch(hideNotification())
};

/* exports */
export {showNotificationAction}