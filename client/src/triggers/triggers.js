import { useState, useEffect } from "react";
import "./triggers.css";

const Triggers = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const getTriggers = async () => {
			const res = await fetch("http://localhost:3000/api/v1/triggers/");
			const logstatus = await res.json();
			console.log(logstatus);
		};
		getTriggers();
	}, []);

	return (
		<div>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">All Triggers</p>
					<p className="subtitle">{message}</p>
				</div>
			</section>
		</div>
	);
};

export default Triggers;
