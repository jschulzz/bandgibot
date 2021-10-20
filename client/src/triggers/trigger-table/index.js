import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { API_URL } from "../../constants";
import { toast } from "bulma-toast";

import "./styles.css";

const TriggerTable = ({ triggers }) => {
	const [sortAsc, setSortAsc] = useState(true);
	const [sortField, setSortField] = useState("trigger");
	const [triggerList, setTriggerList] = useState([]);

	const auth = useContext(AuthContext);

	const deleteTrigger = async (id) => {
		try {
			const res = await fetch(API_URL + `/triggers/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				toast({
					message: "Successfuly deleted",
					type: "is-success",
					dismissible: true,
					pauseOnHover: true,
				});
				const newTriggers = triggerList.filter((x) => x._id !== id);
				setTriggerList(newTriggers);
			}
		} catch {
			toast({
				message: "There was an issue deleting that entry. Try again later",
				type: "is-danger",
				dismissible: true,
				pauseOnHover: true,
			});
		}
	};

	useEffect(() => {
		const sortedRecords = triggers.sort((a, b) => {
			return a[sortField] < b[sortField] ? 1 : -1;
		});
		const orderedRecords = sortAsc ? sortedRecords : sortedRecords.reverse();
		setTriggerList([...orderedRecords]);
	}, [sortField, sortAsc, triggers]);

	return (
		<section className="section">
			<div className="container cards-container">
				{triggerList.map((record, idx) => (
					<div className="card trigger-card" key={idx}>
						{record.image_url && (
							<div className="card-image">
								<img className="image" src={record.image_url} alt="" />
							</div>
						)}
						<div className="card-content">
							<div className="content">
								<p className="columns data-row is-mobile">
									<span className="column is-4 has-text-weight-semibold">
										Trigger Text
									</span>
									<span className="column is-8  has-text-weight-semibold">
										<ul>
											{record.triggers.map((trigger) => {
												return <li key={trigger}>{trigger}</li>;
											})}
										</ul>
									</span>
								</p>
								<p className="columns data-row is-mobile">
									<span className="column is-4 has-text-weight-semibold">
										Message
									</span>
									<span className="column is-8 has-text-justified">
										<small>{record.message}</small>
									</span>
								</p>
								<p className="columns data-row is-mobile">
									<span className="column is-4 has-text-weight-semibold">
										Creator
									</span>
									<span className="column is-8 has-text-right">
										{record.creator}
									</span>
								</p>
								<p className="columns data-row is-mobile">
									<span className="column is-4 has-text-weight-semibold">
										Created
									</span>
									<span className="column is-8 has-text-right">
										<time dateTime={record.created_at}>
											{new Date(record.created_at).toLocaleDateString()}
										</time>
									</span>
								</p>
								{auth.isAdmin && (
									<div className="is-actions-cell">
										<div className="buttons is-right">
											<button
												className="button is-small is-danger"
												type="button"
												onClick={() => deleteTrigger(record._id)}
											>
												<span className="icon">
													<i className="fas fa-trash"></i>
												</span>
											</button>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default TriggerTable;
