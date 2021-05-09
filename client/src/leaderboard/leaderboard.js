import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import "bulma-switch-control/css/main.css";
import "bulma-responsive-tables/css/main.css";

import { API_URL } from "../constants";
import "./leaderboard.css";

const Table = ({ karma, showConcepts, showUsers, searchTerm }) => {
	const [displayedRecords, setDisplayedRecords] = useState([]);
	const [sortAsc, setSortAsc] = useState(true);
	const [sortField, setSortField] = useState("karma");

	const targetClickHandler = () => {
		setSortField("_id");
		setSortAsc(!sortAsc);
	};
	const karmaClickHandler = () => {
		setSortField("karma");
		setSortAsc(!sortAsc);
	};

	useEffect(() => {
		let filteredRecords = karma.filter((record) => {
			if (record.isUser && showUsers) return true;
			if (!record.isUser && showConcepts) return true;
			return false;
		});
		if (searchTerm) {
			const fuse = new Fuse(filteredRecords, {
				keys: ["value", "_id", "karma"],
				includeScore: true,
				ignoreLocation: true,
			});
			filteredRecords = fuse.search(searchTerm).map((x) => x.item);
		}
		const sortedRecords = filteredRecords.sort((a, b) => {
			return a[sortField] < b[sortField] ? 1 : -1;
		});
		const orderedRecords = sortAsc ? sortedRecords : sortedRecords.reverse();

		console.log(orderedRecords, sortField, sortAsc);
		setDisplayedRecords(orderedRecords.slice(0, 10));
	}, [showConcepts, showUsers, karma, sortAsc, sortField, searchTerm]);

	return (
		<section className="section">
			<div className="container">
				<div className="b-table">
					<div class="field table-mobile-sort">
						<div class="field has-addons">
							<div class="control is-expanded">
								<span class="select is-fullwidth">
									<select>
										<option onClick={targetClickHandler}>Target</option>
										<option onClick={karmaClickHandler}>Karma</option>
									</select>
								</span>
							</div>
							<div class="control">
								<button
									onClick={() => setSortAsc(!sortAsc)}
									class="button is-primary"
								>
									<span className="icon is-small">
										<i
											className={
												sortAsc ? "fas fa-sort-up" : "fas fa-sort-down"
											}
										/>
									</span>
								</button>
							</div>
						</div>
					</div>
					<div className="table-wrapper has-mobile-cards">
						<table className="table is-striped is-hoverable is-fullwidth">
							<thead>
								<tr>
									<th className="is-sortable" onClick={targetClickHandler}>
										<div className="th-wrap">
											Target
											{sortField === "_id" && (
												<span className="icon is-small">
													<i
														className={
															sortAsc ? "fas fa-sort-up" : "fas fa-sort-down"
														}
													/>
												</span>
											)}
										</div>
									</th>
									<th className="is-sortable" onClick={karmaClickHandler}>
										<div className="th-wrap">
											Karma
											{sortField === "karma" && (
												<span className="icon is-small">
													<i
														className={
															sortAsc ? "fas fa-sort-up" : "fas fa-sort-down"
														}
													/>
												</span>
											)}
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{displayedRecords.map((record, idx) => (
									<tr key={idx}>
										<td data-label="Target">{record.value || record._id}</td>
										<td data-label="Karma">{record.karma}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
};

const Leaderboard = () => {
	const [karmaScores, setKarmaScores] = useState([]);
	const [showUsers, setShowUsers] = useState(true);
	const [showConcepts, setShowConcepts] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		console.log(process);
		const getLoginStatus = async () => {
			const res = await fetch(API_URL + "/karma");
			const karma = await res.json();
			setKarmaScores(karma);
		};
		getLoginStatus();
	}, []);

	return (
		<div>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">The Karma Leaderboard</p>
					<p className="subtitle">Top 10 results</p>
				</div>
			</section>
			<form className="field is-grouped switch-container">
				<div className="control searchbox">
					<input
						className="input"
						type="text"
						placeholder="Search"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<label className="switch is-rounded">
					<input
						type="checkbox"
						onChange={() => setShowUsers(!showUsers)}
						checked={showUsers}
					/>
					<span className="check"></span>
					<span className="control-label">Show Users</span>
				</label>
				<label className="switch is-rounded">
					<input
						type="checkbox"
						onChange={() => setShowConcepts(!showConcepts)}
						checked={showConcepts}
					/>
					<span className="check"></span>
					<span className="control-label">Show Concepts</span>
				</label>
			</form>
			<Table
				showUsers={showUsers}
				showConcepts={showConcepts}
				karma={karmaScores}
				searchTerm={searchTerm}
			/>
		</div>
	);
};

export default Leaderboard;
