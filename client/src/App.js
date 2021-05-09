import React, { useEffect, useState } from "react";
import "./App.css";
import Triggers from "./triggers/triggers";
import Superlatives from "./superlatives/superlatives";
import Leaderboard from "./leaderboard/leaderboard";
import Login from "./login/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { API_URL } from "./constants";

export const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState();

	const logout = async () => {
		await fetch(API_URL + "/auth/logout");
		setIsLoggedIn(false);
	};

	useEffect(() => {
		const getLoginStatus = async () => {
			const res = await fetch(API_URL + "/auth/loggedin");
			const logstatus = await res.json();
			setIsLoggedIn(logstatus.isLoggedIn);
		};
		getLoginStatus();
	}, []);
	return (
		<Router>
			<div>
				<nav
					role="navigation"
					aria-label="main navigation"
				>
					<div className="navbar-menu">
						<div className="navbar-start">
							<Link to="/leaderboard" className="navbar-item icon-text">
								<span className="nav-text">Leaderboard</span>
								<span className="icon">
									<i className="fas fa-chart-bar"></i>
								</span>
							</Link>
							<Link to="/superlatives" className="navbar-item icon-text">
								<span className="nav-text">Superlatives</span>
								<span className="icon">
									<i className="fas fa-trophy"></i>
								</span>
							</Link>
							<Link to="/triggers" className="navbar-item icon-text">
								<span className="nav-text">Triggers</span>
								<span className="icon">
									<i className="fas fa-bolt"></i>
								</span>
							</Link>
							{/* <div className="navbar-item icon-text"> */}
							{!isLoggedIn ? (
								<Link
									className="navbar-item icon-text button is-link"
									to="/login"
								>
									<span className="nav-text">Login</span>
									<span className="icon has-text-link">
										<i className="fas fa-user"></i>
									</span>
								</Link>
							) : (
								<Link
									className="navbar-item icon-text button is-link"
									onClick={logout}
								>
									<span className="nav-text">Logout</span>
									<span className="icon has-text-link">
										<i className="fas fa-user-slash"></i>
									</span>
								</Link>
							)}
							{/* </div> */}
						</div>
					</div>
				</nav>

				<Switch>
					<Route path="/login">
						<Login />
					</Route>
					<Route path="/superlatives">
						<Superlatives />
					</Route>
					<Route path="/triggers">
						<Triggers />
					</Route>
					<Route path="/leaderboard">
						<Leaderboard />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};
