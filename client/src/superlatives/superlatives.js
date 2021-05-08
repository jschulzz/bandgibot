import { useState, useEffect } from "react";
import "./superlatives.css";

const Superlatives = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const getSuperlatives = async () => {
			const res = await fetch("http://localhost:3000/api/v1/superlative/");
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
