import React, {  useEffect, useState } from "react";
import styles from "./CreateShopItemForm.module.css";
import clsx from "clsx";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import itemIconPlaceholder from "/asset/placeholder.png";
import { ENDPOINTS } from "@/config/endpoints";

function CreateShopItemForm(): React.JSX.Element {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			if (previewUrl)
				URL.revokeObjectURL(previewUrl);
		}
	}, [previewUrl]);

	const createItem = async (formData: FormData) => {
		const res: Response = await fetch(ENDPOINTS.ADMIN.POST.shopItem, {
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
	};

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
		<form
			className={clsx("create-resource-form", styles.container)}
			action={createItem}
			onSubmit={(e: React.FormEvent<HTMLFormElement>) => !previewUrl && e.preventDefault()}
		>
			{/*  icon */}
			<label htmlFor="form-file-input">Choose file</label>
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
			<select required id="form-item-type" name="type">
				<option value="" disabled selected hidden>Select</option>
				<option value="card-back">Card back</option>
				<option value="card-front">Card front</option>
				<option value="table-cloth">Table cloth</option>
			</select>

			{/* name */}
			<input required type="text" name="name" placeholder="item-name" />

			{/* description */}
			<input type="text" name="description" placeholder="item-description" />

			{/* currency */}
			<label htmlFor="form-item-currency">Choose item currency</label>
			<select required id="form-item-currency" name="currency">
				<option value="" disabled selected hidden>Select</option>
				<option value="gold">Gold</option>
				<option value="gem">Gem</option>
			</select>

			{/* price */}
			<input
				required
				type="number"
				name="price"
				min={0}
				placeholder="item-price, digits only"
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
					e.key === '-' && e.preventDefault()
				}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const v = Number(e.target.value);
					if (v < 0)
						e.currentTarget.value = "0";
				}}
			/>

			{/* status */}
			<label htmlFor="form-item-status">Choose item status</label>
			<select required id="form-item-status" name="status">
				<option value="available" selected>Available (default)</option>
				<option value="unavailable">Unavailable</option>
			</select>

			{/* stackable */}
			<label htmlFor="form-item-stackable">Choose item stackable</label>
			<select required id="form-item-stackable" name="stackable">
				<option value="" disabled selected hidden>Select</option>
				<option value="true">Stackable</option>
				<option value="false">Unstackable</option>
			</select>

			<SubmitButton text="Create" />
		</form>
	);
}

export default CreateShopItemForm;