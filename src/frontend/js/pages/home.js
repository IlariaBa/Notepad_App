import React, { useContext, useState, useEffect } from "react";
import "../../styles/home.css";

import { getCategories } from "../../client-API/backendAPI";

import { NotesList } from "../component/notesList";
import { AddNoteModal } from "../component/addNoteModal";
import { AddCategoryModal } from "../component/addCategoryModal";

export const Home = () => {

	const [updateNotes, setUpdateNotes] = useState(false);
	const [updateCategories, setUpdateCategories] = useState(false);
	const [filter, setFilter] = useState('active'); // 'all', 'active', 'archived'
	const [categoryFilter, setCategoryFilter] = useState(null);

	const handleNoteAdded = () => {
		setUpdateNotes(prev => !prev);
	};

	const handleCategoriesAdded = () => {
		setUpdateCategories(prev => !prev);
	};

	const handleCategoryFilter = (categoryId) => {
		setCategoryFilter(categoryId === categoryFilter ? null : categoryId);
	};

	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [categories, setCategories] = useState();

	useEffect(() => {
		fetchesCategories();
	}, [updateCategories]);

	const fetchesCategories = async () => {
		setErrorMsg("");
		setIsLoading(true);

		try {
			const data = await getCategories();
			setCategories(data);
			setIsLoading(false);
		} catch (error) {
			console.error(`Error fetching categories: `, error);
			setErrorMsg(error.message);
			setIsLoading(false);
		}
	};

	return (
		<div className="container mt-5">
			<h1 className="text-center mb-4">Notepad</h1>
			<div className="d-grid gap-2 mb-2">
				<button
					className="btn btn-outline-primary"
					type="button"
					data-bs-toggle="modal"
					data-bs-target="#addNoteModal">
					Add Note
				</button>
			</div>
			<div className="d-flex">
				<div className="dropdown col-md-4 mb-4 me-2">
					<button
						className="btn btn-outline-secondary dropdown-toggle w-100"
						type="button"
						id="filterDropdown"
						data-bs-toggle="dropdown"
						aria-expanded="false">
						Notes: {filter.charAt(0).toUpperCase() + filter.slice(1)}
					</button>
					<ul className="dropdown-menu" aria-labelledby="filterDropdown">
						<li>
							<button className="dropdown-item" onClick={() => setFilter("all")}>All</button>
						</li>
						<li>
							<button className="dropdown-item" onClick={() => setFilter("active")}>Active</button>
						</li>
						<li>
							<button className="dropdown-item" onClick={() => setFilter("archived")}>Archived</button>
						</li>
					</ul>
				</div>

				<div className="dropdown me-2 col-md-4">
					<button
						className="btn btn-outline-secondary w-100 dropdown-toggle"
						type="button"
						id="categoryDropdown"
						data-bs-toggle="dropdown"
						aria-expanded="false">
						Category Filter
					</button>
					<ul className="dropdown-menu" aria-labelledby="categoryDropdown">
						<li>
							<button className="dropdown-item" onClick={() => handleCategoryFilter(null)}>All</button>
						</li>
						{categories && categories.results.map((category) => (
							<li key={category.id}>
								<button
									className="dropdown-item"
									onClick={() => handleCategoryFilter(category.id)}>
									{category.category_name}
								</button>
							</li>
						))}
					</ul>
				</div>

				<div className="col-md-4">
					<button
						className="btn btn-outline-primary w-100"
						type="button"
						data-bs-toggle="modal"
						data-bs-target="#addCategoryModal">
						Add new category
					</button>
				</div>
			</div>
			<NotesList updateNotes={updateNotes} updateCategories={updateCategories} filter={filter} categoryFilter={categoryFilter} />
			<AddNoteModal onNoteAdded={handleNoteAdded} />
			<AddCategoryModal onCategoryAdded={handleCategoriesAdded} />
		</div>
	);
};
