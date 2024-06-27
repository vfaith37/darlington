// src/pages/contact.tsx
"use client";

import { useState } from "react";
import Header from "../_components/Navbar";

const Contact = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await fetch("../api/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name, email, message }),
		});

		if (res.ok) {
			alert("Email sent successfully!");
		} else {
			alert("Failed to send email.");
		}
	};

	return (
		<main className="container mx-auto p-4">
			<h1>Contact Us</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block">Name</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>
				<div>
					<label className="block">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>
				<div>
					<label className="block">Message</label>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="w-full p-2 border border-gray-300 rounded"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					Send
				</button>
			</form>
		</main>
	);
};

export default Contact;
