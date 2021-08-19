import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App.js";
import { API_URL } from "../constants.js";
import SuperlativeForm from "./superlative-form";
import SuperlativeTable from "./superlative-table";
import "./superlatives.css";

const Superlatives = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [mySuperlatives, setMySuperlatives] = useState([]);
	const [allSuperlatives, setAllSuperlatives] = useState([]);

    const auth = useContext(AuthContext); 

	useEffect(() => {
		const getSuperlatives = async () => {
			let res = await fetch(API_URL + "/superlative/mine");
			let superlatives = await res.json();
			setMySuperlatives(superlatives);
			res = await fetch(API_URL + "/superlative");
			superlatives = await res.json();
			setAllSuperlatives(superlatives);
		};
		getSuperlatives();
	}, [activeTab]);

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
							<span>My Superlatives</span>
						</a>
					</li>
					{auth.isAdmin && (
						<li
							className={activeTab === 2 ? "is-active" : ""}
							onClick={() => setActiveTab(2)}
						>
							<a>
								<span>All Superlatives</span>
							</a>
						</li>
					)}
				</ul>
			</div>
			{activeTab === 0 && <SuperlativeForm />}
			{activeTab === 1 && <SuperlativeTable superlatives={mySuperlatives} />}
			{activeTab === 2 && <SuperlativeTable superlatives={allSuperlatives} />}
		</div>
	);
};

export default Superlatives;
