const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const activeUsers = {}; // Store user positions

io.on("connection", (socket) => {
	console.log("Connected: ", socket.id);

	// Store the user's initial position
	activeUsers[socket.id] = { x: 0, y: 0 };

	// Send the positions of all active users to the newly connected user
	socket.emit("initialPositions", activeUsers);

	socket.on("move", (newPosition) => {
		// Update the user's position
		activeUsers[socket.id] = newPosition;
		// Broadcast the new position to all connected users, including the sender
		io.emit("position", { userId: socket.id, position: newPosition });
	});

	socket.on("disconnect", () => {
		console.log("Disconnected: ", socket.id);
		// Remove the user from the activeUsers object when they disconnect
		delete activeUsers[socket.id];
		// Broadcast the updated user list and remove the disconnected user's position
		io.emit("userList", Object.keys(activeUsers));
		io.emit("removePosition", socket.id);
	});
});

// SERVER
const PORT = 4000;
const start = async () => {
	try {
		httpServer.listen(PORT, "0.0.0.0", () =>
			console.log(`server running on port ${PORT} :)`)
		);
	} catch (error) {
		console.log(":(", error);
	}
};
start();
