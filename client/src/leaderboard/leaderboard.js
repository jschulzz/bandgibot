import { useState, useEffect } from "react";
import "./leaderboard.css";

const Leaderboard = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const getLoginStatus = async () => {
			const res = await fetch("http://localhost:3000/api/v1/karma/");
			const logstatus = await res.json();
			console.log(logstatus);
		};
		getLoginStatus();
	}, []);

	return (
		<div>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">The Karma Leaderboard</p>
					<p className="subtitle">{message}</p>
				</div>
			</section>
		</div>
	);
};

export default Leaderboard;
