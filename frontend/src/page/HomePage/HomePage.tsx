import React from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/shallow";
import useScreenStack from "@/lib/store/screen-stack/screen-stack";
import useUser from "@/lib/store/user/user";
import { ENDPOINTS } from "@/config/endpoints";
import Modal from "@/component/Modal/Modal";
import { useModal } from "@/component/Modal/Modal.hook";

function HomePage(): React.JSX.Element {
	const pushScreen = useScreenStack((state) => state.push);
	const user = useUser(useShallow((state) => ({
		id: state.id,
		displayName: state.displayName,
		tagLine: state.tagLine,
		role: state.role,
		gold: state.gold,
		gem: state.gem
	})));
	const clearUser = useUser((state) => state.clear);
	const navigate = useNavigate();
	const [isModalOpen, openModal, closeModal] = useModal(false);

	const signout = async () => {
		try {
			let res = await fetch(ENDPOINTS.AUTH.signOut, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include"
			});

			if (!res.ok)
				return;

			clearUser();
			navigate("/");
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<>
			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={closeModal}
				title={"MODAL"}
			>
				<p>This is the modal's content</p>
			</Modal>

			<p style={{ margin: "10px auto", width: "fit-content", fontSize: "2rem" }}>HOME</p>
			<p>id: {user.id}</p>
			<p>displayName: {user.displayName}</p>
			<p>tagLine: {user.tagLine}</p>
			<p>role: {user.role}</p>
			<p>gold: {user.gold}</p>
			<p>gem: {user.gem}</p>

			<button onClick={signout}>
				Sign out
			</button>

			<button onClick={() => pushScreen("shop")}>
				Go to SHOP
			</button>

			<button onClick={() => pushScreen("inventory")}>
				Go to INVENTORY
			</button>

			<button onClick={openModal}>
				Open modal
			</button>

			{user.role === "admin" &&
				<button onClick={() => pushScreen("admin")}>
					Admin panel
				</button>
			}
		</>
	);
}

export default HomePage;