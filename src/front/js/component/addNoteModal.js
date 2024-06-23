import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { addNote } from "../../client-API/backendAPI";

export const AddNoteModal = ({ onNoteAdded }) => {

    const { register, handleSubmit, reset } = useForm();

    const [addNoteError, setAddNoteError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setAddNoteError("");
            setIsSubmitting(true);

            await addNote(JSON.stringify(data));

            reset(); // Reset form after adding the new note
            onNoteAdded(); //Call onNoteAdded to update the notes list

            //Close modal
            const myModal = document.getElementById('addNoteModal');
            const modal = window.bootstrap.Modal.getInstance(myModal);
            modal.hide();

            setIsSubmitting(false);

        } catch (error) {
            setAddNoteError(error.message);
            setIsSubmitting(false);
        }
      };

    return (
        <div className="modal fade" id="addNoteModal" tabIndex="-1" aria-labelledby="addNoteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="addNoteModalLabel">Add Note</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {addNoteError && <div className="alert alert-danger">{addNoteError}</div>}
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting} onClick={() => setShowEditModal(false)}>
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}