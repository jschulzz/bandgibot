import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import Triggers from "./triggers";
import Superlatives from "./superlatives";
import Leaderboard from "./leaderboard";
import Login from "./login";
import {
	Switch,
	Route,
	Link,
	Redirect,
	useLocation,
} from "react-router-dom";
import { API_URL } from "./constants";

export const AuthContext = createContext({
	isLoggedIn: false,
	isInGroup: false,
	isAdmin: false,
});

export const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isInGroup, setIsInGroup] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const logout = async () => {
		await fetch(API_URL + "/auth/logout");
		setIsLoggedIn(false);
		setIsInGroup(false);
		setIsAdmin(false);
	};

	const getAuth = async () => {
		const res = await fetch(API_URL + "/auth/permissions");
		const { isInGroup, isAdmin, isLoggedIn } = await res.json();
		setIsInGroup(isInGroup);
		setIsAdmin(isAdmin);
		setIsLoggedIn(isLoggedIn);
	};

	let location = useLocation();

	useEffect(() => {
		getAuth();
	}, [location]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, isAdmin, isInGroup }}>
			<div className="main-container">
				<nav role="navigation" aria-label="main navigation">
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
					<Route
						path="/superlatives"
						render={() => {
							return isLoggedIn && isInGroup ? (
								<Superlatives />
							) : (
								<Redirect to="/login" />
							);
						}}
					></Route>
					<Route
						path="/triggers"
						render={() => {
							return isLoggedIn && isInGroup ? (
								<Triggers />
							) : (
								<Redirect to="/login" />
							);
						}}
					></Route>
					<Route
						path="/leaderboard"
						render={() => {
							return isLoggedIn && isInGroup ? (
								<Leaderboard />
							) : (
								<Redirect to="/login" />
							);
						}}
					></Route>
				</Switch>
			</div>
		</AuthContext.Provider>
	);
};
