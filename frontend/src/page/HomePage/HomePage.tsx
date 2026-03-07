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
import MatchFoundModal from "@/component/Modal/MatchFoundModal";

// TODO: setting

type PlayerState = "idle" | "inQueue" | "inGame";

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
	const [isMatchFoundModalOpen, openMatchFoundModal, closeMatchFoundModal] = useModal(false);

	const [modalContent, setModalContent] = useState<React.ReactNode>(undefined);
	const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

	const [playerState, setPlayerState] = useState<PlayerState>("idle");
	const [queueSize, setQueueSize] = useState(0);

	useEffect(() => {
		if (!socket.connected)
			socket.connect();

		const handleQueueSize = (queueSize: number) => setQueueSize(queueSize);
		socket.on("queueSize", handleQueueSize);

		const handlePlayerState = (playerState: PlayerState) => setPlayerState(playerState);
		socket.on("playerState", handlePlayerState);

		const handleMatchFound = () => {
			openMatchFoundModal();
			setTimeout(() => {
				closeMatchFoundModal();
				pushScreen("game");
			}, 3000);
		};
		socket.on("matchFound", handleMatchFound);

		return () => {
			socket.off("queueSize", handleQueueSize);
			socket.off("playerState", handlePlayerState);
			socket.off("matchFound", handleMatchFound);
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

		<MatchFoundModal
			isOpen={isMatchFoundModalOpen}
		/>

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
					<span>{playerState === "inQueue" ? "QUEUEING" : "PLAY"}</span>
					<span>{queueSize} in queue</span>
				</button>

				<div className={styles.nav}>
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