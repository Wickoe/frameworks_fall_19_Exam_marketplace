export function notification(state = {display: false}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case "DISPLAY_NOTIFICATION":
            newState["display"] = true;
            newState["msg"] = action["msg"];
            newState["level"] = action["level"];

            return newState;
        case "HIDE_NOTIFICATION":
            newState["display"] = false;
            newState["msg"] = "";
            newState["level"] = 0;

            return newState;
        default:
            return newState;
    }
}