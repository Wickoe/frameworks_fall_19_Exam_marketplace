export function categories(state = {
    categories: [],
    books: [],
    categoryBooks: [],
    book: {},
    bookCategory: {},
    bookSeller: {}
}, action) {
    const newState = {...state};

    switch (action["type"]) {
        case 'UPDATE_CATEGORY':
            let index = 0,
                found = false;

            while(!found && index < newState["categories"].length) {
                found = action["category"]["_id"] === newState["categories"][index]["_id"];

                index++;
            }

            if(!found) {
                newState["categories"].push(action["category"]);
            }

            return newState;
        case 'UPDATE_CATEGORIES':
             action["categories"].forEach(category => {
                let index = 0;
                let found = false;

                while(!found && index < newState["categories"].length) {
                    found = category["_id"] === newState["categories"][index]["_id"];

                    index++;
                }

                if(!found)
                    newState["categories"].push(category);
            });

            return newState;
        case 'UPDATE_BOOK':
            newState["book"] = action["book"];

            return newState;
        case 'UPDATE_BOOKS':
            action["books"].forEach(function (book) {
                let found = false;
                let index = 0;

                while (!found && index < newState["books"].length) {
                    const containedBook = newState["books"][index];

                    found = containedBook["title"] === book["title"] &&
                        containedBook["author"] === book["author"] &&
                        containedBook["category"] === book["category"] &&
                        containedBook["price"] === book["price"];

                    index++;
                }

                if (!found) {
                    newState["books"].push(book);
                }
            });

            return newState;
        case 'UPDATE_CATEGORY_BOOKS':
            newState["categoryBooks"] = action["books"];

            return newState;
        case 'UPDATE_SELLING_BOOK':
            newState["bookSeller"] = action["seller"];
            newState["bookCategory"] = action["category"];

            return newState;
        case 'REMOVE_CATEGORY':
            let defaultCategory;

            newState["categories"].forEach((category, index) => {
                if (category["_id"] === action["category"]["_id"]) {
                    newState["categories"].splice(index, 1);
                }

                if (category["title"] === (process.env.REACT_APP_DEFAULT_CATEGORY)) {
                    defaultCategory = category["_id"];
                }
            });

            newState["books"].forEach(book => {
                if (book["category"] === action["category"]) {
                    book["category"] = defaultCategory;
                }
            });

            return newState;
        default:
            return {...state};
    }
}