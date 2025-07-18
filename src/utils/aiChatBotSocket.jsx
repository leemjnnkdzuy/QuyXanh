// WebSocket utility for AI ChatBot with integrated helpers

// Helper functions for AI ChatBot
export const formatTime = (timestamp) => {
	const date = new Date(timestamp);
	const now = new Date();
	const diffInMs = now - date;
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes < 1) {
		return "Vừa xong";
	} else if (diffInMinutes < 60) {
		return `${diffInMinutes} phút trước`;
	} else if (diffInHours < 24) {
		return `${diffInHours} giờ trước`;
	} else if (diffInDays < 7) {
		return `${diffInDays} ngày trước`;
	} else {
		return date.toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	}
};

export const formatMessageTime = (timestamp) => {
	const date = new Date(timestamp);
	return date.toLocaleTimeString("vi-VN", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
};

export const sanitizeMessage = (message) => {
	// Basic HTML sanitization
	return message
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#x27;");
};

export const linkifyText = (text) => {
	// Simple URL detection and linkification
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	return text.replace(
		urlRegex,
		'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
	);
};

export const formatMessageContent = (content) => {
	// Format message content with basic markdown-like features
	let formatted = sanitizeMessage(content);

	// Bold text
	formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

	// Italic text
	formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

	// Code blocks
	formatted = formatted.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

	// Inline code
	formatted = formatted.replace(/`(.*?)`/g, "<code>$1</code>");

	// Line breaks
	formatted = formatted.replace(/\n/g, "<br>");

	// Links
	formatted = linkifyText(formatted);

	return formatted;
};

export const generateMessageId = () => {
	return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getMessageStatus = (message) => {
	if (message.error) {
		return "error";
	}
	if (message.sender === "user") {
		return message.sent ? "sent" : "sending";
	}
	return "received";
};

export const groupMessagesByDate = (messages) => {
	const grouped = {};

	messages.forEach((message) => {
		const date = new Date(message.timestamp);
		const dateKey = date.toDateString();

		if (!grouped[dateKey]) {
			grouped[dateKey] = [];
		}

		grouped[dateKey].push(message);
	});

	return grouped;
};

export const getDateLabel = (dateString) => {
	const date = new Date(dateString);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) {
		return "Hôm nay";
	} else if (date.toDateString() === yesterday.toDateString()) {
		return "Hôm qua";
	} else {
		return date.toLocaleDateString("vi-VN", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}
};

export const isValidMessage = (message) => {
	return (
		message &&
		typeof message === "object" &&
		typeof message.text === "string" &&
		message.text.trim().length > 0 &&
		["user", "bot"].includes(message.sender)
	);
};

export const createUserMessage = (text, userId) => {
	return {
		id: generateMessageId(),
		text: text.trim(),
		sender: "user",
		timestamp: new Date().toISOString(),
		userId: userId,
		sent: false,
	};
};

export const createBotMessage = (text, metadata = {}) => {
	return {
		id: generateMessageId(),
		text: text.trim(),
		sender: "bot",
		timestamp: new Date().toISOString(),
		metadata: metadata,
	};
};

export const createErrorMessage = (error) => {
	return {
		id: generateMessageId(),
		text: "Xin lỗi, có lỗi xảy ra khi xử lý tin nhắn của bạn. Vui lòng thử lại.",
		sender: "bot",
		timestamp: new Date().toISOString(),
		error: true,
		errorDetails: error,
	};
};

export const shouldShowTimestamp = (currentMessage, previousMessage) => {
	if (!previousMessage) return true;

	const current = new Date(currentMessage.timestamp);
	const previous = new Date(previousMessage.timestamp);
	const diffInMinutes = (current - previous) / (1000 * 60);

	return diffInMinutes > 5 || currentMessage.sender !== previousMessage.sender;
};

// Constants
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_MESSAGES_PER_SESSION = 50;
export const TYPING_TIMEOUT = 3000;
export const RECONNECT_DELAY = 1000;
export const MAX_RECONNECT_ATTEMPTS = 5;

class AIChatBotSocket {
	constructor() {
		this.socket = null;
		this.isConnected = false;
		this.messageHandlers = new Set();
		this.connectionHandlers = new Set();
		this.reconnectAttempts = 0;
		this.maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS;
		this.reconnectDelay = RECONNECT_DELAY;
		this.heartbeatInterval = null;
		this.typingTimeout = null;
		this.user = null;
		this.token = null;
		this.messageQueue = [];
		this.isTyping = false;
	}

	// Initialize connection
	connect(token, user) {
		this.token = token;
		this.user = user;

		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			return;
		}

		try {
			// Replace with your actual WebSocket server URL
			const wsUrl = `ws://localhost:8080/ws/chat?token=${encodeURIComponent(
				token
			)}&userId=${encodeURIComponent(user.id)}`;
			this.socket = new WebSocket(wsUrl);

			this.socket.onopen = this.handleOpen.bind(this);
			this.socket.onmessage = this.handleMessage.bind(this);
			this.socket.onclose = this.handleClose.bind(this);
			this.socket.onerror = this.handleError.bind(this);
		} catch (error) {
			console.error("Failed to create WebSocket connection:", error);
			this.notifyConnectionHandlers({type: "error", error});
		}
	}

	// Handle connection opened
	handleOpen() {
		console.log("AI ChatBot WebSocket connected");
		this.isConnected = true;
		this.reconnectAttempts = 0;
		this.startHeartbeat();

		// Send queued messages
		this.sendQueuedMessages();

		// Request chat history
		this.requestChatHistory();

		this.notifyConnectionHandlers({type: "connected"});
	}

	// Handle incoming messages
	handleMessage(event) {
		try {
			const data = JSON.parse(event.data);

			// Handle different message types
			switch (data.type) {
				case "message":
					const botMessage = createBotMessage(data.message, data.metadata);
					this.notifyMessageHandlers({
						type: "message",
						message: {
							...botMessage,
							id: data.id || botMessage.id,
							timestamp: data.timestamp || botMessage.timestamp,
							formattedContent: formatMessageContent(data.message),
							formattedTime: formatMessageTime(data.timestamp || botMessage.timestamp),
						},
					});
					break;

				case "typing":
					this.notifyMessageHandlers({
						type: "typing",
						isTyping: data.isTyping,
					});
					break;

				case "history":
					const formattedHistory = this.getFormattedHistory(data.messages || []);
					this.notifyMessageHandlers({
						type: "history",
						messages: formattedHistory,
						groupedMessages: this.getGroupedMessages(data.messages || []),
					});
					break;

				case "error":
					const errorMessage = createErrorMessage(data.error);
					this.notifyMessageHandlers({
						type: "error",
						error: data.error,
						errorMessage: errorMessage,
					});
					break;

				case "pong":
					// Handle heartbeat response
					break;

				case "user_count":
					this.notifyMessageHandlers({
						type: "user_count",
						count: data.count,
					});
					break;

				case "system":
					this.notifyMessageHandlers({
						type: "system",
						message: data.message,
					});
					break;

				default:
					console.warn("Unknown message type:", data.type);
			}
		} catch (error) {
			console.error("Error parsing WebSocket message:", error);
			this.notifyMessageHandlers({
				type: "error",
				error: "Lỗi khi xử lý tin nhắn từ server",
				errorMessage: createErrorMessage(error),
			});
		}
	}

	// Handle connection closed
	handleClose(event) {
		console.log("AI ChatBot WebSocket disconnected:", event.code, event.reason);
		this.isConnected = false;
		this.stopHeartbeat();
		this.setTypingStatus(false);

		this.notifyConnectionHandlers({
			type: "disconnected",
			code: event.code,
			reason: event.reason,
		});

		// Attempt to reconnect if not a clean close
		if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
			this.attemptReconnect();
		}
	}

	// Handle connection error
	handleError(error) {
		console.error("AI ChatBot WebSocket error:", error);
		this.notifyConnectionHandlers({type: "error", error});
	}

	// Attempt to reconnect
	attemptReconnect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.log("Max reconnection attempts reached");
			return;
		}

		this.reconnectAttempts++;
		const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

		console.log(
			`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`
		);

		setTimeout(() => {
			if (this.token && this.user) {
				this.connect(this.token, this.user);
			}
		}, delay);
	}

	// Start heartbeat
	startHeartbeat() {
		this.heartbeatInterval = setInterval(() => {
			if (this.isConnected && this.socket.readyState === WebSocket.OPEN) {
				this.socket.send(JSON.stringify({type: "ping"}));
			}
		}, 30000); // Send ping every 30 seconds
	}

	// Stop heartbeat
	stopHeartbeat() {
		if (this.heartbeatInterval) {
			clearInterval(this.heartbeatInterval);
			this.heartbeatInterval = null;
		}
	}

	// Send message to AI with validation and formatting
	sendMessage(message) {
		if (!message || typeof message !== "string") {
			console.error("Invalid message format");
			return false;
		}

		// Validate message length
		if (message.length > MAX_MESSAGE_LENGTH) {
			console.error("Message too long");
			this.notifyMessageHandlers({
				type: "error",
				error: `Tin nhắn quá dài. Tối đa ${MAX_MESSAGE_LENGTH} ký tự.`,
			});
			return false;
		}

		if (
			!this.isConnected ||
			!this.socket ||
			this.socket.readyState !== WebSocket.OPEN
		) {
			console.error("WebSocket is not connected");
			// Queue message for later sending
			this.messageQueue.push({
				message: message,
				timestamp: new Date().toISOString(),
				userId: this.user?.id,
			});
			return false;
		}

		try {
			const messageData = {
				type: "message",
				message: sanitizeMessage(message),
				userId: this.user?.id,
				timestamp: new Date().toISOString(),
			};

			this.socket.send(JSON.stringify(messageData));
			return true;
		} catch (error) {
			console.error("Error sending message:", error);
			return false;
		}
	}

	// Send queued messages when connection is restored
	sendQueuedMessages() {
		if (!this.isConnected || this.messageQueue.length === 0) {
			return;
		}

		const messagesToSend = [...this.messageQueue];
		this.messageQueue = [];

		messagesToSend.forEach((messageData) => {
			try {
				this.socket.send(
					JSON.stringify({
						type: "message",
						...messageData,
					})
				);
			} catch (error) {
				console.error("Error sending queued message:", error);
				// Put failed message back in queue
				this.messageQueue.push(messageData);
			}
		});
	}

	// Set typing status
	setTypingStatus(isTyping) {
		if (this.isTyping === isTyping) return;

		this.isTyping = isTyping;

		if (
			!this.isConnected ||
			!this.socket ||
			this.socket.readyState !== WebSocket.OPEN
		) {
			return;
		}

		try {
			this.socket.send(
				JSON.stringify({
					type: "typing",
					isTyping: isTyping,
					userId: this.user?.id,
				})
			);
		} catch (error) {
			console.error("Error sending typing status:", error);
		}

		// Auto-stop typing after timeout
		if (isTyping) {
			if (this.typingTimeout) {
				clearTimeout(this.typingTimeout);
			}
			this.typingTimeout = setTimeout(() => {
				this.setTypingStatus(false);
			}, TYPING_TIMEOUT);
		} else {
			if (this.typingTimeout) {
				clearTimeout(this.typingTimeout);
				this.typingTimeout = null;
			}
		}
	}

	// Get formatted message history
	getFormattedHistory(messages) {
		return messages.map((msg) => ({
			...msg,
			formattedContent: formatMessageContent(msg.text),
			formattedTime: formatMessageTime(msg.timestamp),
			relativeTime: formatTime(msg.timestamp),
		}));
	}

	// Get grouped messages by date
	getGroupedMessages(messages) {
		const grouped = groupMessagesByDate(messages);
		const result = {};

		Object.keys(grouped).forEach((dateKey) => {
			result[dateKey] = {
				label: getDateLabel(dateKey),
				messages: this.getFormattedHistory(grouped[dateKey]),
			};
		});

		return result;
	}

	// Create and validate user message
	createUserMessage(text) {
		if (!text || typeof text !== "string") {
			return null;
		}

		const message = createUserMessage(text, this.user?.id);
		return isValidMessage(message) ? message : null;
	}

	// Handle message with typing indicator
	sendMessageWithTyping(message) {
		// Start typing indicator
		this.setTypingStatus(true);

		// Send message after short delay to simulate typing
		setTimeout(() => {
			const success = this.sendMessage(message);

			// Stop typing indicator
			this.setTypingStatus(false);

			if (!success) {
				// Notify error
				this.notifyMessageHandlers({
					type: "error",
					error: "Không thể gửi tin nhắn. Vui lòng thử lại.",
				});
			}
		}, 500);
	}

	// Request chat history
	requestChatHistory() {
		if (
			!this.isConnected ||
			!this.socket ||
			this.socket.readyState !== WebSocket.OPEN
		) {
			return;
		}

		try {
			this.socket.send(
				JSON.stringify({
					type: "get_history",
					userId: this.user?.id,
				})
			);
		} catch (error) {
			console.error("Error requesting chat history:", error);
		}
	}

	// Clear chat history
	clearChatHistory() {
		if (
			!this.isConnected ||
			!this.socket ||
			this.socket.readyState !== WebSocket.OPEN
		) {
			return;
		}

		try {
			this.socket.send(
				JSON.stringify({
					type: "clear_history",
					userId: this.user?.id,
				})
			);
		} catch (error) {
			console.error("Error clearing chat history:", error);
		}
	}

	// Add message handler
	addMessageHandler(handler) {
		this.messageHandlers.add(handler);
	}

	// Remove message handler
	removeMessageHandler(handler) {
		this.messageHandlers.delete(handler);
	}

	// Add connection handler
	addConnectionHandler(handler) {
		this.connectionHandlers.add(handler);
	}

	// Remove connection handler
	removeConnectionHandler(handler) {
		this.connectionHandlers.delete(handler);
	}

	// Notify message handlers
	notifyMessageHandlers(data) {
		this.messageHandlers.forEach((handler) => {
			try {
				handler(data);
			} catch (error) {
				console.error("Error in message handler:", error);
			}
		});
	}

	// Notify connection handlers
	notifyConnectionHandlers(data) {
		this.connectionHandlers.forEach((handler) => {
			try {
				handler(data);
			} catch (error) {
				console.error("Error in connection handler:", error);
			}
		});
	}

	// Disconnect
	disconnect() {
		this.stopHeartbeat();
		this.setTypingStatus(false);

		if (this.socket) {
			this.socket.close(1000, "User disconnected");
			this.socket = null;
		}

		this.isConnected = false;
		this.reconnectAttempts = 0;
		this.messageQueue = [];
		this.token = null;
		this.user = null;
	}

	// Get connection status
	getConnectionStatus() {
		return {
			isConnected: this.isConnected,
			readyState: this.socket?.readyState,
			reconnectAttempts: this.reconnectAttempts,
			queuedMessages: this.messageQueue.length,
			isTyping: this.isTyping,
			user: this.user,
		};
	}

	// Utility methods for message management
	validateConnection() {
		return (
			this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN
		);
	}

	// Get message statistics
	getMessageStats() {
		return {
			queuedMessages: this.messageQueue.length,
			connectionAttempts: this.reconnectAttempts,
			maxReconnectAttempts: this.maxReconnectAttempts,
			isTyping: this.isTyping,
		};
	}

	// Force reconnection
	forceReconnect() {
		if (this.socket) {
			this.socket.close();
		}
		this.reconnectAttempts = 0;
		if (this.token && this.user) {
			setTimeout(() => {
				this.connect(this.token, this.user);
			}, 100);
		}
	}

	// Clear message queue
	clearMessageQueue() {
		this.messageQueue = [];
	}

	// Get WebSocket ready state as string
	getReadyStateString() {
		if (!this.socket) return "NO_SOCKET";

		switch (this.socket.readyState) {
			case WebSocket.CONNECTING:
				return "CONNECTING";
			case WebSocket.OPEN:
				return "OPEN";
			case WebSocket.CLOSING:
				return "CLOSING";
			case WebSocket.CLOSED:
				return "CLOSED";
			default:
				return "UNKNOWN";
		}
	}

	// Export conversation history
	exportConversation(messages) {
		const formattedMessages = messages.map((msg) => ({
			timestamp: msg.timestamp,
			sender: msg.sender,
			text: msg.text,
			formattedTime: formatMessageTime(msg.timestamp),
		}));

		return {
			exportedAt: new Date().toISOString(),
			user: this.user,
			messages: formattedMessages,
			totalMessages: formattedMessages.length,
		};
	}
}

// Create singleton instance
const aiChatBotSocket = new AIChatBotSocket();

export default aiChatBotSocket;
