import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { addCategory } from "../../client-API/backendAPI";

export const AddCategoryModal = ({ onCategoryAdded }) => {
    const { register, handleSubmit, reset } = useForm();
    const [addCategoryError, setAddCategoryError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        try {
            setAddCategoryError("");
            setIsSubmitting(true);

            await addCategory(JSON.stringify(data));

            reset(); // Reset form after adding the new category
            onCategoryAdded(); // Call onCategoryAdded to update the category list

            // Close modal
            const myModal = document.getElementById('addCategoryModal');
            const modal = window.bootstrap.Modal.getInstance(myModal);
            modal.hide();

            setIsSubmitting(false);
        } catch (error) {
            setAddCategoryError(error.message);
            setIsSubmitting(false);
        }
    };

    const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];

    return (
        <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="addCategoryModalLabel">Add New Category</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {addCategoryError && <div className="alert alert-danger">{addCategoryError}</div>}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <input type="text" className="form-control" id="categoryName" {...register("category_name", { required: true })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Color</label>
                                {colors.map((color) => (
                                    <div key={color} className={`form-check form-check rounded ${color}`}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id={`color-${color}`}
                                            value={color}
                                            {...register("color")}
                                        />
                                        <label className="form-check-label" htmlFor={`color-${color}`}>{color.charAt(0).toUpperCase() + color.slice(1)}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
