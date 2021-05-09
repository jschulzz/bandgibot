import { useState, useEffect } from "react";
import { API_URL } from "../constants.js";
import "./superlatives.css";

const Superlatives = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const getSuperlatives = async () => {
			const res = await fetch(API_URL + "/superlative/");
			const logstatus = await res.json();
			console.log(logstatus);
		};
		getSuperlatives();
	}, []);

	return (
		<div>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">All Superlatives</p>
					<p className="subtitle">{message}</p>
				</div>
			</section>
		</div>
	);
};

export default Superlatives;
