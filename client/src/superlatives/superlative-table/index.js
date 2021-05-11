import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { API_URL } from "../../constants";
import { toast } from "bulma-toast";

import "./styles.css";

const SuperlativeTable = ({ superlatives }) => {
	const [sortAsc, setSortAsc] = useState(true);
	const [sortField, setSortField] = useState("karma");
	const [superlativeList, setSuperlativeList] = useState([]);

	const auth = useContext(AuthContext);

	const deleteSuperlative = async (id) => {
		try {
			const res = await fetch(API_URL + `/superlative/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				toast({
					message: "Successfuly deleted",
					type: "is-success",
					dismissible: true,
					pauseOnHover: true,
				});
				const newSuperlatives = superlativeList.filter((x) => x._id !== id);
				setSuperlativeList(newSuperlatives);
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
		const sortedRecords = superlatives.sort((a, b) => {
			return a[sortField] < b[sortField] ? 1 : -1;
		});
		const orderedRecords = sortAsc ? sortedRecords : sortedRecords.reverse();
		setSuperlativeList([...orderedRecords]);
	}, [sortField, sortAsc, superlatives]);

	return (
		<section className="section">
			<div className="container cards-container">
				{superlativeList.map((record, idx) => (
					<div class="card superlative-card" key={idx}>
						{record.image_url && (
							<div class="card-image">
								<img class="image" src={record.image_url} alt="" />
							</div>
						)}
						<div className="card-content">
							<div className="content">
								<p className="columns data-row is-mobile">
									<span className="column is-4 has-text-weight-semibold">
										Karma
									</span>
									<span className="column is-8 has-text-right has-text-weight-semibold">
										{record.karma}
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
										<div class="buttons is-right">
											<button
												class="button is-small is-danger"
												type="button"
												onClick={() => deleteSuperlative(record._id)}
											>
												<span class="icon">
													<i class="fas fa-trash"></i>
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

export default SuperlativeTable;
