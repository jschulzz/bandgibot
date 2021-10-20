import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App.js";
import { API_URL } from "../constants";
import TriggerForm from "./trigger-form";
import TriggerTable from "./trigger-table";
import "./triggers.css";

const Triggers = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [myTriggers, setMyTriggers] = useState([]);
	const [allTriggers, setAllTriggers] = useState([]);

	const auth = useContext(AuthContext);

	useEffect(() => {
		const getTriggers = async () => {
			let res = await fetch(API_URL + "/triggers/mine");
			let triggers = await res.json();
			setMyTriggers(triggers);
			res = await fetch(API_URL + "/triggers");
			triggers = await res.json();
			setAllTriggers(triggers);
		};
		getTriggers();
	}, []);

	return (
		<div className="superlative-page">
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">Superlatives</p>
				</div>
			</section>
			<div className="superlative-tabs tabs is-boxed is-centered">
				<ul>
					<li
						className={activeTab === 0 ? "is-active" : ""}
						onClick={() => setActiveTab(0)}
					>
						<a>
							<span>Submission</span>
						</a>
					</li>
					<li
						className={activeTab === 1 ? "is-active" : ""}
						onClick={() => setActiveTab(1)}
					>
						<a>
							<span>My Triggers</span>
						</a>
					</li>
					{auth.isAdmin && (
						<li
							className={activeTab === 2 ? "is-active" : ""}
							onClick={() => setActiveTab(2)}
						>
							<a>
								<span>All Triggers</span>
							</a>
						</li>
					)}
				</ul>
			</div>
			{activeTab === 0 && <TriggerForm />}
			{activeTab === 1 && <TriggerTable triggers={myTriggers} />}
			{activeTab === 2 && <TriggerTable triggers={allTriggers} />}
		</div>
	);
};

export default Triggers;
