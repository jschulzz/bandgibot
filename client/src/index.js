import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./App";

ReactDOM.render(
	<React.StrictMode>
		<>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1"
			></meta>
			<App />
		</>
	</React.StrictMode>,
	document.getElementById("root")
);
