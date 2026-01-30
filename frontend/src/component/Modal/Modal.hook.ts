import { useState } from "react";

function useModal(init = false): [
	boolean,
	() => void,
	() => void
] {
	const [isOpen, setIsOpen] = useState(init);
	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return [isOpen, openModal, closeModal];
}

export { useModal };