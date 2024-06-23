import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { deleteNote } from "../../client-API/backendAPI";
import { editNote } from "../../client-API/backendAPI";

export const NoteCard = ({ note, categories, onNoteDeleted, onNoteUpdated }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [noteDelete, setNoteDelete] = useState();
    const [noteEdit, setNoteEdit] = useState();
    const [noteActive, setNoteActive] = useState(note.is_active);
    const [noteCategories, setNoteCategories] = useState(note.categories);

    const onDelete = async (data) => {
        setErrorMsg("");
        setIsLoading(true);

        try {
            const response = await deleteNote(noteDelete.id);
            setIsLoading(false);
            setShowConfirmModal(false);
            onNoteDeleted();  // Llamar a la función para actualizar la lista de notas
        } catch (error) {
            console.error("Error on note deleting: ", error);
            setErrorMsg(error.message);
            setIsLoading(false);
        }
    }

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            title: "",
            content: "",
        },
        mode: "onBlur"
    });

    useEffect(() => {
        if (noteEdit) {
            reset({
                title: noteEdit.title,
                content: noteEdit.content,
            });
        }
    }, [noteEdit, reset]);

    const [editNoteError, setEditNoteError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setEditNoteError("");
            setIsSubmitting(true);
            await editNote(noteEdit.id, data);

            reset(); // Reset form after editing the new note
            onNoteUpdated(); //Call onNoteUpdated to update the notes list

            //Close modal
            setShowEditModal(false);

            setIsSubmitting(false);

        } catch (error) {
            setEditNoteError(error.message);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const noteToArchive = note;
        noteToArchive.is_active = noteActive;
        archiveNote(noteToArchive)
    }, [noteActive])

    const archiveNote = async (data) => {
        try {
            await editNote(data.id, data);
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    // Function to handle adding category to note
    const handleAddCategory = async (category) => {
        try {
            let updatedCategories = [...noteCategories];

            // If the category is already added to the note, remove it from the list of note categories
            if (updatedCategories.some(cat => cat.id === category.id)) {
                updatedCategories = updatedCategories.filter(cat => cat.id !== category.id);
            } else {
                // If the category is not added to the note, add it to the list of note categories
                updatedCategories.push(category);
            }

            setNoteCategories(updatedCategories);
            await editNote(note.id, { ...note, categories: updatedCategories });

            onNoteUpdated();
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    if (!note) {
        return <div className="fst-italic">There are no notes</div>;
    }

    return (
        <div className="h-100">
            <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                    {note.categories.length > 0 ? (
                        <div className="d-flex">
                            {note.categories.map((category) => (
                                <div key={category.id} className={`me-2 px-3 py-1 rounded ${category.color}`}>{category.category_name}</div>
                            ))}
                        </div>
                    ) : (
                        <div className="fst-italic">No categories</div>
                    )}
                    <div className="dropstart ms-auto">
                        <button type="button" className="btn btn-outline-primary rounded-circle" id="filterDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button className="dropdown-item" onClick={() => handleAddCategory(category)}>
                                        {category.category_name}
                                    </button>
                                </li>
                            ))}
                            {categories.length == 0 && <li className="fst-italic ms-2">Add category above</li>}
                        </ul>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.content}</p>
                </div>
                <div className="card-footer d-flex">
                    {noteActive ?
                        <button type="button"
                            className="btn btn-outline-warning"
                            onClick={() => setNoteActive(!noteActive)}>
                            <i className="fa-solid fa-box-archive"></i>
                        </button>
                        :
                        <button type="button"
                            className="btn btn-warning"
                            onClick={() => setNoteActive(!noteActive)}>
                            <i className="fa-solid fa-box-archive"></i>
                        </button>}
                    <button type="button"
                        className="btn btn-primary ms-auto"
                        onClick={() => {
                            setShowEditModal(true);
                            setNoteEdit(note);
                        }}>
                        <i className="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button"
                        className="btn btn-danger ms-2"
                        onClick={() => {
                            setShowConfirmModal(true);
                            setNoteDelete(note);
                        }}>
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>

            {/* Modal that asks for confirmation to delete the note*/}
            {noteDelete &&
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: showConfirmModal ? 'block' : 'none' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Delete</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowConfirmModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <h5 className="text-center mb-3">Are you sure you want to delete this note?</h5>
                                <h6>{noteDelete.title}</h6>
                                <p>{noteDelete.content}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    data-bs-dismiss="modal"
                                    onClick={() => {
                                        onDelete();
                                        setShowConfirmModal(false);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Modal for edit the note*/}
            {noteEdit &&
                <div className="modal" tabIndex="-1" role="dialog" aria-hidden="true" style={{ display: showEditModal ? 'block' : 'none' }}>
                    {console.log(noteEdit)}
                    {console.log(showEditModal)}
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Edit Note</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {editNoteError && <div className="alert alert-danger">{editNoteError}</div>}
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="mb-3">
                                        <label htmlFor="noteTitle" className="form-label">Title</label>
                                        <input type="text" className="form-control" id="noteTitle" {...register("title", { required: true })} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="noteContent" className="form-label">Content</label>
                                        <textarea className="form-control" id="noteContent" rows="3" {...register("content")} />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowEditModal(false)}>Close</button>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? "Saving..." : "Save changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            }

        </div>
    )
}