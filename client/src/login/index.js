import { OAUTH_URL } from "../constants";
import "./login.css";

const Login = () => {
	const openAuth = () => {
		window.open(OAUTH_URL, "_parent");
	};

	return (
		<>
			<section className="hero is-info">
				<div className="hero-body">
					<p className="title">Login</p>
				</div>
			</section>
			<section className="section">
				<div className="card">
					<div className="card-content">
						<p className="title">Hey friend</p>
						<div className="content">
							In order to access everything on this site, you do need to be an
							authorized member of the groupchat this relates to. And to do
							that, you need to sign in with GroupMe
							<br />
							<br />
							When you click the link below, you'll be redirected to the GroupMe
							login. Once you log in, you'll be redirected back here, and
							(assuming you're in the group chat), you'll have access to
							everything
						</div>
					</div>
					<footer className="card-footer">
						<a onClick={openAuth} className="card-footer-item">
							Sign in with GroupMe
						</a>
					</footer>
				</div>
			</section>
		</>
	);
};

export default Login;
