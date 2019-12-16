export function notification(state = {display: false}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case "SHOW_NOTIFICATION":
            newState["display"] = true;
            newState["msg"] = action["msg"];

            return newState;
        case "HIDE_NOTIFICATION":
            newState["display"] = false;
            newState["msg"] = "";

            return newState;
        default:
            return newState;
    }
}