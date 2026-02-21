import React, {  useEffect, useState } from "react";
import styles from "./CreateShopItemForm.module.css";
import clsx from "clsx";
import SubmitButton from "@/component/SubmitButton/SubmitButton";
import itemIconPlaceholder from "/asset/placeholder.png";
import { ENDPOINTS } from "@/config/endpoints";

type PseudoStackable = "" | "true" | "false";

function CreateShopItemForm(): React.JSX.Element {
	const [stackable, setStackable] = useState<PseudoStackable>("");
	const [quantity, setQuantity] = useState<number | "">("");

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			if (previewUrl)
				URL.revokeObjectURL(previewUrl);
		}
	}, [previewUrl]);

	useEffect(() => {
		if (stackable === "true")
			setQuantity((q) => (q === "" || q < 1 ? 1 : q));
		else if (stackable === "false") // Be explicit
			setQuantity("");
	}, [stackable]);

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
			<select required id="form-item-type" name="type" defaultValue="">
				<option value="" disabled hidden>Select</option>
				<option value="card-back">Card Back</option>
				<option value="card-face">Card Face</option>
				<option value="table-cloth">Table Cloth</option>
			</select>

			{/* name */}
			<input required type="text" name="name" placeholder="item-name" />

			{/* description */}
			<input type="text" name="description" placeholder="item-description" />

			{/* stackable */}
			<label htmlFor="form-item-stackable">Choose item stackable</label>
			<select
				required
				id="form-item-stackable"
				name="stackable"
				value={stackable}
				onChange={(e) => { setStackable(e.target.value as PseudoStackable) }}
			>
				<option value="" disabled hidden>Select</option>
				<option value="true">Stackable</option>
				<option value="false">Unstackable</option>
			</select>

			{/* currency */}
			<label htmlFor="form-item-currency">Choose item currency</label>
			<select required id="form-item-currency" name="currency" defaultValue="">
				<option value="" disabled hidden>Select</option>
				<option value="gold">Gold</option>
				<option value="gem">Gem</option>
			</select>

			{/* quantity */}
			<input
				// required={}
				type="number"
				name="quantity"
				min={1}
				placeholder="item-quantity, digits only"
				value={quantity}
				required={stackable === "true"}
				disabled={stackable !== "true"}
				onKeyDown={(e) => e.key === "-" && e.preventDefault()}
				onChange={(e) => {
					const v = e.target.value;
					if (v === "") {
						setQuantity("");
						return;
					}
					setQuantity(Number(v));
				}}
				onBlur={() => (quantity === "" || quantity < 1) && setQuantity(1)}
			/>

			{/* price */}
			<input
				required
				type="number"
				name="price"
				min={0}
				placeholder="item-price, digits only"
				onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
					e.key === "-" && e.preventDefault()
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
				<option value="available">Available (default)</option>
				<option value="unavailable">Unavailable</option>
			</select>

			<SubmitButton text="Create" />
		</form>
	);
}

export default CreateShopItemForm;