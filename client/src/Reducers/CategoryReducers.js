export function categories(state = {categories: []}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case 'UPDATE_CATEGORY':
            if (!newState["categories"].includes(category => {
                return category["title"] === action["category"]["title"];
            })) {
                newState["categories"].push(action["category"]);
            }

            return newState;
        case 'UPDATE_CATEGORIES':
            newState["categories"] = action["categories"];

            return newState;
        default:
            return {...state};
    }
}