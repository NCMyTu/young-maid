import { io } from "socket.io-client";
import { API_BASE_URL } from "@/config/endpoints";

const options = {
	autoConnect: false,
	withCredentials: true,
}

const socket = io(API_BASE_URL, options);

export { socket };