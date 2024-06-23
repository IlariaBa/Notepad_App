const apiUrlBase = process.env.BACKEND_URL;

/////////////////////////////////////////////////////
//Notes

//Get all notes
export const getNotes = async() => {
    try {
        const response = await fetch(`${apiUrlBase}/api/note`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg);
        }

        const data = await response.json()
        return data;

    } catch (error) {
        console.error('Error on getting notes: ', error);
        throw error;
    }
}

//Get note by id
export const getNote = async (note_id) => {
    try {
        const response = await fetch(`${apiUrlBase}/api/note/${note_id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error on getting note:', error);
        throw error;
    }
}

//Add new note
export const addNote = async (newNote) => {
    try {
        const response = await fetch(`${apiUrlBase}/api/note`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: newNote,
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = data;
            throw new Error(errorData.msg);
        }

        // Returns the new note
        return data.result;

    } catch (error) {
        console.error('Error trying to add a new note', error);
        throw error;
    }
}

//Delete note
export const deleteNote = async (note_id) => {
    try {
        const response = await fetch(`${apiUrlBase}/api/note/${note_id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = data;
            throw new Error(errorData.msg);
        }

        return true;

    } catch (error) {
        console.error('Error trying to delete a note', error);
        throw error;
    }
}

//Edit note
export const editNote = async (note_id, modifiedNote) => {
    try {
        const response = await fetch(`${apiUrlBase}/api/note/${note_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(modifiedNote),
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = data;
            throw new Error(errorData.msg);
        }

        // Returns the modified note
        return data;

    } catch (error) {
        console.error('Error trying to modify a note', error);
        throw error;
    }
}

///////////////////////
//Categories

//Get all categories
export const getCategories = async() => {
    try {
        const response = await fetch(`${apiUrlBase}/api/category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg);
        }

        const data = await response.json()
        return data;

    } catch (error) {
        console.error('Error on getting categories: ', error);
        throw error;
    }
}

//Add new category
export const addCategory = async (newCategory) => {
    try {
        const response = await fetch(`${apiUrlBase}/api/category`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: newCategory,
        });
        const data = await response.json();

        if (!response.ok) {
            const errorData = data;
            throw new Error(errorData.msg);
        }

        // Returns the new category
        return data.result;

    } catch (error) {
        console.error('Error trying to add a new category', error);
        throw error;
    }
}
