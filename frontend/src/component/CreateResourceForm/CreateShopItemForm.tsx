import React, {  useEffect, useState } from "react";
import styles from "./CreateResourceForm.module.css";
import clsx from "clsx";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import itemIconPlaceholder from "/asset/placeholder.png";

function CreateShopItemForm(): React.JSX.Element {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			if (previewUrl)
				URL.revokeObjectURL(previewUrl);
		}
	}, [previewUrl]);

	const createItem = async (formData: FormData) => {
		const res: Response = await fetch("http://localhost:19722/admin/api/items/shop", {
			method: "POST",
			credentials: "include",
			body: formData
		});

		if (!res.ok) {
			const errorText = await res.text();
			alert(`${res.status} Failed to create item: ${errorText}`);
			return;
		}

		setPreviewUrl(null);
		alert("Created item successfully!");
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = e.target.files?.[0];
		if (!uploadedFile)
			return;

		setPreviewUrl(prevPreviewUrl => {
			if (prevPreviewUrl)
				URL.revokeObjectURL(prevPreviewUrl);
			return URL.createObjectURL(uploadedFile);
		});
	};

	return (
		<form action={createItem} className={clsx("create-resource-form", styles.container)}>
			{/*  icon */}
			<label htmlFor="form-file-input" className={clsx(styles.fileInput)}>Choose file</label>
			<input
				id="form-file-input"
				type="file"
				accept="image/*"
				name="item-icon"
				onChange={handleFileChange}
				hidden
			/>
			<img
				className={clsx(styles.iconPreview)}
				src={previewUrl ?? itemIconPlaceholder}
			/>

			{/* type */}
			<label htmlFor="form-item-type">Choose item type</label>
			<select id="form-item-type" name="type" required>
				<option value="" disabled selected hidden>Select</option>
				<option value="card-back">Card back</option>
			</select>

			{/* name */}
			<input type="text" name="name" placeholder="item-name" />

			{/* description */}
			<input type="text" name="description" placeholder="item-description" />

			{/* currency */}
			<label htmlFor="form-item-currency">Choose item currency</label>
			<select id="form-item-currency" name="currency" required>
				<option value="" disabled selected hidden>Select</option>
				<hr />
				<option value="gold">Gold</option>
				<option value="gem">Gem</option>
			</select>

			{/* price */}
			<input type="number" name="price" placeholder="item-price, digits only" />

			{/* status */}
			<label htmlFor="form-item-status">Choose item status</label>
			<select id="form-item-status" name="status" required>
				<option value="" disabled selected hidden>Select</option>
				<hr />
				<option value="available">Available</option>
				<option value="unavailable">Unavailable</option>
			</select>

			<SubmitButton text="Create" />
		</form>
	);
}

export default CreateShopItemForm;