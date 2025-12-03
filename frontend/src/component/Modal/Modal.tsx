import React from "react";
import ReactDom from "react-dom";
import clsx from "clsx";
import styles from "./Modal.module.css";
import type { IModalProps } from "./Modal.type";
import xIcon from "/asset/icon/x.svg";

function Modal({ isShowing, onClose, onConfirm, children, title }: IModalProps): React.JSX.Element | null {
	if (!isShowing)
		return null;

	const portal = document.getElementById("portal");
	if (!portal)
		return null;

	return ReactDom.createPortal(
		<>
			<div
				className={clsx("modal-overlay", styles.overlay)}
				onClick={onClose}
			/>

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
						<img src={xIcon} />
					</button>
				</div>

				<div className={clsx("modal-content", styles.content)}>
					{children}
				</div>

				<div className={clsx("modal-action", styles.actionContainer)}>
					{onConfirm ? (
						<>
						<button id="button-cancel" className={clsx("modal-button-action", styles.actionButton)} onClick={onClose}>
							Cancel
						</button>
						<button id="button-confirm" className={clsx("modal-button-action", styles.actionButton)} onClick={onConfirm}>
							Confirm
						</button>
						</>
					) : (
						<button
							id="button-confirm"
							className={clsx("modal-button-action", styles.actionButton)}
							onClick={onClose}
						>
							Confirm
						</button>
					)}
				</div>
			</div>
		</>,
		portal
	);
}

export default Modal;