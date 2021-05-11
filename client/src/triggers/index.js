import { useState, useEffect } from "react";
import { API_URL } from "../constants";
import "./triggers.css";

const Triggers = () => {
	const [message, setMessage] = useState("");

	useEffect(() => {
		const getTriggers = async () => {
			const res = await fetch(API_URL + "/triggers");
			const logstatus = await res.json();
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
            <div className="columns">
				<div className="column is-half is-offset-one-quarter">
					<img
						className="image coming-soon"
                        src="https://i.redd.it/k23fdquqfhe11.jpg"
                        alt="Coming Soon"
					/>
					<div className="has-text-centered is-size-3">
						This page is under construction
					</div>
					<div className="has-text-centered is-size-3">Come back later!</div>
				</div>
			</div>
		</div>
	);
};

export default Triggers;
