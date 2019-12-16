const showNotification = (msg, level) => ({
    type: 'DISPLAY_NOTIFICATION',
    msg: msg,
    level: level
});

const showNotificationAction = (msg, level, displayTimer) => async function(dispatch) {
    dispatch(showNotification(msg, level));

    setTimeout(_ => dispatch(hideNotificationAction()), displayTimer)
};

const hideNotification = _ => ({
    type: 'HIDE_NOTIFICATION'
});

const hideNotificationAction = _ => async function (dispatch) {
    dispatch(hideNotification())
};

/* exports */
export {showNotificationAction}