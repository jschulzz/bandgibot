import { useState, useEffect } from "react";
import { toast } from "bulma-toast";
import { API_URL } from "../../constants.js";
import "./styles.css";
const testImage = (url) => {
	return new Promise(function (resolve, reject) {
		var timeout = 5000;
		var timer,
			img = new Image();
		img.onerror = img.onabort = function () {
			clearTimeout(timer);
			reject("error");
		};
		img.onload = function () {
			clearTimeout(timer);
			resolve("success");
		};
		timer = setTimeout(function () {
			// reset .src to invalid URL so it stops previous
			// loading, but doesn't trigger new load
			img.src = "//!!!!/test.jpg";
			reject("timeout");
		}, timeout);
		img.src = url;
	});
};

const SuperlativeForm = () => {
	const [triggerText, setTriggerText] = useState(null);
	const [message, setMessage] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [imageError, setImageError] = useState(false);
	const [canSubmit, setCanSubmit] = useState(false);

	const submitTrigger = async () => {
		let toastMessage = "";
		let type = "is-info";
		if (canSubmit) {
			const submission = await fetch(API_URL + "/triggers", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					trigger: triggerText,
					message,
					image_url: imageURL,
				}),
			});
			if (submission.ok) {
				toastMessage = "Trigger successfully submitted";
				type = "is-success";
			} else {
				let response = await submission.json();
				toastMessage = response.message || "Unknown error";
				type = "is-danger";
			}
			toast({
				message: toastMessage,
				type,
				dismissible: true,
				pauseOnHover: true,
			});
		}
	};

	const imageHandler = async (e) => {
		if (!e.target.value) {
			setImageError(false);
			setImageURL("");
		}
		try {
			await testImage(e.target.value);
			setImageURL(e.target.value);
			setImageError(false);
		} catch {
			setImageError(true);
		}
	};

	useEffect(() => {
		setCanSubmit(false);
		if (!triggerText && triggerText !== "") return;
		if (imageURL && imageError) return;
		setCanSubmit(true);
	}, [triggerText, imageError, imageURL]);

	return (
		<div className="trigger-form">
			<section className="section">
				<div className="columns is-desktop">
					<form className="column is-8 is-offset-2">
						<article className="message is-info">
							<div className="message-header">
								<p>Rules of the Road</p>
							</div>
							<div className="message-body">
								Here you can choose when/how Bandgibot reacts to people sending
								messages with certain text. You can see a preview of your
								message down below. Both the message and image are optional, but
								you should probably include at least one.
								<br />
								<br />
							</div>
						</article>
						<div className="field">
							<label className="label">Triggering text (required)</label>
							<div className="control">
								<input
									type="text"
									className="input"
									placeholder="Triggering Text"
									onChange={(e) => setTriggerText(e.target.value)}
								/>
							</div>
							<p className="help">Exact text that triggers this response</p>
						</div>
						<div className="field">
							<label className="label">Message</label>
							<p className="control">
								<textarea
									className="textarea"
									placeholder="Your message"
									onChange={(e) => setMessage(e.target.value)}
								/>
							</p>
							<p className="help">
								Message to send upon someone sending the triggering text
							</p>
						</div>
						<div className="field">
							<label className="label">Attached Image</label>
							<p className="control">
								<input
									className="input"
									type="text"
									placeholder="An image URL"
									onChange={imageHandler}
								/>
							</p>
							{imageURL === "" && (
								<p className="help">
									The URL of the image you want to send with the message
								</p>
							)}
							{imageURL && imageError && (
								<p className="help is-danger">
									That URL doesn't seem to lead to an image
								</p>
							)}
							{imageURL && !imageError && (
								<p className="help is-success">That URL should work nicely!</p>
							)}
						</div>
						<div className="field">
							<div className="control">
								<button
									className="button is-link"
									type="button"
									disabled={!canSubmit}
									onClick={submitTrigger}
								>
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
			<section className="trigger-preview section">
				<div className="message-container columns is-desktop">
					<div className="column is-8 is-offset-2">
						<p className="trigger-title title">Preview</p>
						<div className="trigger-message columns is-mobile">
							<div></div>
							<div className="column is-1">
								<span className="icon is-large">
									<i className="fas fa-user-circle fa-lg"></i>
								</span>
							</div>
							<div className="column is-9 has-text-left">
								<span className="response-text">
									Lorem ipsum <strong>{triggerText}</strong> dolor sit amet
								</span>
							</div>
							<div className="column is-2">
								<span className="heart icon is-large">
									<i className="far fa-heart"></i>
								</span>
							</div>
						</div>
						<div className="trigger-message columns is-mobile">
							<div className="column is-1">
								<span className="icon is-large">
									<i className="fas fa-user-circle fa-lg"></i>
								</span>
							</div>
							<div className="column is-9 has-text-left">
								<p className="trigger-text">{message}</p>
							</div>
							<div className="column is-2">
								<span className="heart icon is-large">
									<i className="far fa-heart"></i>
								</span>
							</div>
						</div>
						{imageURL && !imageError && (
							<div className="trigger-message columns is-mobile">
								<img
									className="trigger-image column is-8 is-offset-2 image"
									src={imageURL}
									alt="Doesn't look like that URL worked"
								/>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};

export default SuperlativeForm;
