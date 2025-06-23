import React, {useState, useEffect} from "react";
import {healthCheck} from "../../utils/request";

function HealthCheck() {
	const [status, setStatus] = useState("checking");
	const [message, setMessage] = useState("");

	useEffect(() => {
		const checkHealth = async () => {
			try {
				const response = await healthCheck();
				if (response.success) {
					setStatus("healthy");
					setMessage("API is running properly");
				} else {
					setStatus("unhealthy");
					setMessage(response.message || "API is not responding correctly");
				}
			} catch (error) {
				setStatus("error");
				setMessage("Cannot connect to API");
			}
		};

		checkHealth();
	}, []);

	const getStatusColor = () => {
		switch (status) {
			case "healthy":
				return "#2dd881";
			case "unhealthy":
				return "#f59e0b";
			case "error":
				return "#ef4444";
			default:
				return "#6b7280";
		}
	};

	return (
		<div
			style={{
				padding: "16px",
				margin: "16px",
				border: "2px solid",
				borderColor: getStatusColor(),
				borderRadius: "8px",
				backgroundColor: `${getStatusColor()}10`,
			}}
		>
			<h3 style={{margin: 0, color: getStatusColor()}}>
				API Health Status: {status.toUpperCase()}
			</h3>
			<p style={{margin: "8px 0 0 0", color: getStatusColor()}}>{message}</p>
		</div>
	);
}

export default HealthCheck;
