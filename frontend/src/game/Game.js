import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const Game = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [socket, setSocket] = useState(null);
	const [userPositions, setUserPositions] = useState({});

	useEffect(() => {
		const newSocket = io("/");
		setSocket(newSocket);
		newSocket.on("connect", () => {
			console.log("SOCKET CONNECTED");
		});
		newSocket.on("position", (data) => {
			setUserPositions((prevUserPositions) => ({
				...prevUserPositions,
				[data.userId]: data.position,
			}));
		});
		newSocket.on("removePosition", (userId) => {
			setUserPositions((prevUserPositions) => {
				const updatedPositions = { ...prevUserPositions };
				delete updatedPositions[userId];
				return updatedPositions;
			});
		});
		newSocket.on("initialPositions", (initialPositions) => {
			setUserPositions(initialPositions);
		});
		newSocket.on("userList", (users) => {
			console.log("Active Users:", users);
		});

		return () => newSocket.disconnect();
	}, []);

	const handleMove = (e) => {
		const { clientX, clientY } = e;
		const newPosition = { x: clientX, y: clientY };
		setPosition(newPosition);
		socket && socket.emit("move", newPosition);
	};

	return (
		<div style={{ position: "relative", width: "100vw", height: "100vh" }}>
			{Object.keys(userPositions).map((userId) => (
				<div
					key={userId}
					style={{
						position: "absolute",
						width: "20px",
						height: "20px",
						backgroundColor: "blue",
						left: `${userPositions[userId].x}px`,
						top: `${userPositions[userId].y}px`,
					}}
				></div>
			))}
			<div
				style={{
					position: "absolute",
					width: "20px",
					height: "20px",
					backgroundColor: "red",
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			></div>
			<div
				style={{ position: "absolute", width: "100%", height: "100%" }}
				onMouseMove={handleMove}
			></div>
		</div>
	);
};

export default Game;
