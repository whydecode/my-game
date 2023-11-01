"use client";
import Image from "next/image";
import styles from "./page.module.css";
import io from "socket.io-client";
import Game from "@/game/Game";
export default function Home() {
	return (
		<main className={styles.main}>
			<Game />
		</main>
	);
}
