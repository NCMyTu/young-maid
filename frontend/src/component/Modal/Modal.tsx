import React from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./Modal.module.css";
import type { IModalProps } from "./Modal.type";
import closeIcon from "/asset/icon/x.svg";

function Modal({
	isOpen,
	onClose,
	onConfirm,
	confirmText = "Confirm",
	children,
	title
}: IModalProps): React.JSX.Element {
	if (!isOpen)
		return <></>;

	const portal = document.getElementById("portal");
	if (!portal)
		return <></>;

	return ReactDOM.createPortal(
		<div
			className={clsx("modal-overlay", styles.overlay)}
			onClick={onClose}
		>
			<div
				className={clsx("modal", styles.modal)}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={clsx("modal-top-bar", styles.topBar)}>
					{title && (
						<p className={clsx("title", styles.title)}>
							{title}
						</p>
					)}
					<button className={clsx("close", styles.closeButton)} onClick={onClose}>
						<img src={closeIcon} />
					</button>
				</div>

				<div className={clsx("modal-content", styles.content)}>
					{children}
				</div>

				<div className={clsx("modal-action", styles.actionContainer)}>
					{onConfirm ? (
						<>
							<button
								className={clsx("modal-button-action", styles.actionButton)}
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								className={clsx("modal-button-action", styles.actionButton)}
								onClick={() => {
									onConfirm();
									onClose();
								}}
							>
								{confirmText}
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								className={clsx("modal-button-action", styles.actionButton)}
								onClick={onClose}
							>
								Confirm
							</button>
						</>
					)}
				</div>
			</div>
		</div>,
		portal
	);
}

export default Modal;