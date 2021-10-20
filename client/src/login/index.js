import { OAUTH_URL, API_URL } from "../constants";
import { useContext } from "react";
import { AuthContext } from "../App.js";

import "./login.css";

const Login = () => {
	const openAuth = () => {
		window.open(OAUTH_URL, "_parent");
	};

	const logout = async () => {
		await fetch(API_URL + "/auth/logout");
	};

	const auth = useContext(AuthContext);

	return (
		<>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">{auth.isLoggedIn ? "Logout" : "Login"}</p>
				</div>
			</section>
			<section className="section">
				<div className="card">
					<div className="card-content">
						<p className="title">Hey friend</p>
						{auth.isLoggedIn ? (
							<div className="content">
								You're currently logged in. Click the button below to logout
								<br />
							</div>
						) : (
							<div className="content">
								In order to access everything on this site, you do need to be an
								authorized member of the groupchat this relates to. And to do
								that, you need to sign in with GroupMe
								<br />
								<br />
								When you click the link below, you'll be redirected to the
								GroupMe login. Once you log in, you'll be redirected back here,
								and (assuming you're in the group chat), you'll have access to
								everything
							</div>
						)}
					</div>
					<footer className="card-footer">
						{auth.isLoggedIn ? (
							<a onClick={logout} className="card-footer-item">
								Logout
							</a>
						) : (
							<a onClick={openAuth} className="card-footer-item">
								Sign in with GroupMe
							</a>
						)}
					</footer>
				</div>
			</section>
		</>
	);
};

export default Login;
