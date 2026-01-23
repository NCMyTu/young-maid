import { useCallback, useState } from "react";

function useModal(init = false): [
	boolean,
	() => void,
	() => void
] {
	const [isOpen, setIsOpen] = useState(init);
	const openModal = useCallback(() => setIsOpen(true), []);
	const closeModal = useCallback(() => setIsOpen(false), []);

	return [isOpen, openModal, closeModal];
}

export { useModal };