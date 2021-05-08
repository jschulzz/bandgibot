import "./login.css";

const Login = () => {
	const openAuth = () => {
		window.open(
			"https://oauth.groupme.com/oauth/authorize?client_id=teC6nGeGlqd2qKgEDmT6BwGhRh9RD2T7denuA6tC3T8cHKO6",
			"_parent"
		);
	};

	return (
		<section className="hero is-info">
			<div className="hero-body">
				<p className="title">To view this, you need to sign in with GroupMe</p>
				<p className="subtitle" onClick={openAuth}>
					Do that here
				</p>
			</div>
		</section>
	);
};

export default Login;
