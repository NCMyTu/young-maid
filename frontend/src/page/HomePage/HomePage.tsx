import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import useUser from "@/lib/store/user/user";
import { ENDPOINTS } from "@/config/endpoints";
import Modal from "@/component/Modal/Modal";
import { useModal } from "@/component/Modal/Modal.hook";
import TopBar from "@/component/TopBar/TopBar";
import ResourceBadges from "@/component/TopBar/Group/ResourceBadges";
import UserAvatarName from "@/component/TopBar/Group/UserAvatarName";
import UserActions from "@/component/TopBar/Group/UserActions";
import { socket } from "@/lib/socket";

// TODO: setting

const signout = async () => {
	let res = await fetch(ENDPOINTS.AUTH.signOut, {
		method: "POST",
		credentials: "include"
	});
	if (!res.ok)
		alert("Something went wrong while trying to sign you out.")
};

function HomePage(): React.JSX.Element {
	const pushScreen = useScreenStack((state) => state.push);
	const user = useUser(useShallow((state) => ({ ...state })));
	const clearUser = useUser((state) => state.clear);
	const navigate = useNavigate();

	const [isModalOpen, openModal, closeModal] = useModal(false);
	const [modalContent, setModalContent] = useState<React.ReactNode>(undefined);
	const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

	const [isInQueue, setIsInQueue] = useState(false);
	const [queueSize, setQueueSize] = useState(0);

	useEffect(() => {
		if (!socket.connected)
			socket.connect();

		const handleQueueSize = (queueSize: number) => setQueueSize(queueSize);
		socket.on("queueSize", handleQueueSize);

		const handlePlayerState = (data: { isInQueue: boolean, queueSize: number }) => {
			setIsInQueue(data.isInQueue);
			setQueueSize(data.queueSize);
		}
		socket.on("playerState", handlePlayerState);

		return () => {
			socket.off("queueSize", handleQueueSize);
			socket.off("playerState", handlePlayerState);
		};
	}, []);

	return (<>
		<Modal
			isOpen={isModalOpen}
			onClose={() => {
				setModalContent(undefined);
				setModalOnConfirm(undefined);
				closeModal();
			}}
			onConfirm={modalOnConfirm}
			title={"Warning"}
		>
			{modalContent}
		</Modal>

		<div className={styles.container} >
			<TopBar className={styles.topBar}>
				<UserAvatarName
					avatar={user.avatar}
					displayName={user.displayName}
					tagLine={user.tagLine}
				/>

				<ResourceBadges gold={user.gold} gem={user.gem} />

				<UserActions
					settingOnClick={() => openModal()}
					signOutOnClick={() => {
						setModalContent(<span>You will be signed out. Are you sure?</span>)
						setModalOnConfirm(() => async () => {
							await signout();
							clearUser();
							navigate("/");
						})
						openModal();
					}}
				/>
			</TopBar>

			<div className={styles.primary}>
				<button
					className={styles.playBtn}
					onClick={() => {
						socket.emit("interactWithQueue");
					}}
				>
					{`${isInQueue ? "QUEUEING" : "PLAY"}\n(${queueSize} in queue)`}
				</button>

				<div className={styles.pageNav}>
					<button onClick={() => pushScreen("shop")}>
						SHOP
					</button>

					<button onClick={() => pushScreen("inventory")}>
						INVENTORY
					</button>

					{user.role === "admin" &&
						<button onClick={() => pushScreen("admin")}>
							ADMIN
						</button>
					}
				</div>
			</div>
		</div></>
	);
}

export default HomePage;