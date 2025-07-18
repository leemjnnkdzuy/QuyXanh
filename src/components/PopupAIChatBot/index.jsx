import React, {useState, useEffect, useRef, useCallback} from "react";
import classNames from "classnames/bind";
import style from "./PopupAIChatBot.module.scss";
import {useAuth} from "../../utils/authContext";
import SpinnerLoading from "../SpinnerLoading";
import PopupNotification from "../PopupNotification";
import aiChatBotSocket, {
	formatMessageTime,
	createUserMessage,
	isValidMessage,
	MAX_MESSAGE_LENGTH,
} from "../../utils/aiChatBotSocket";

const cx = classNames.bind(style);

function PopupAIChatBot() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [isConnected, setIsConnected] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showLabel, setShowLabel] = useState(true);
	const [isLabelFadingOut, setIsLabelFadingOut] = useState(false);
	const [notification, setNotification] = useState(null);

	const {isAuthenticated, user, token} = useAuth();
	const messagesEndRef = useRef(null);
	const inputRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	};

	const showNotification = (message, type = "error") => {
		setNotification({message, type});
	};

	const closeNotification = () => {
		setNotification(null);
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const shouldShowLabel = scrollY <= window.innerHeight;

			if (showLabel && !shouldShowLabel) {
				setIsLabelFadingOut(true);
				setTimeout(() => {
					setShowLabel(false);
					setIsLabelFadingOut(false);
				}, 300);
			} else if (!showLabel && shouldShowLabel) {
				setShowLabel(true);
				setIsLabelFadingOut(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showLabel]);

	const handleSocketMessage = useCallback((data) => {
		switch (data.type) {
			case "message":
				setMessages((prev) => [...prev, data.message]);
				setIsTyping(false);
				break;
			case "typing":
				setIsTyping(data.isTyping);
				break;
			case "history":
				setMessages(data.messages || []);
				break;
			case "error":
				console.error("Chat error:", data.error);
				showNotification(data.error || "Có lỗi xảy ra khi kết nối chat", "error");
				setIsTyping(false);
				break;
			default:
				break;
		}
	}, []);

	const handleSocketConnection = useCallback((data) => {
		switch (data.type) {
			case "connected":
				setIsConnected(true);
				showNotification("Đã kết nối thành công!", "success");
				break;
			case "disconnected":
				setIsConnected(false);
				setIsTyping(false);
				showNotification("Mất kết nối chat", "warning");
				break;
			case "error":
				console.error("Connection error:", data.error);
				showNotification(data.error || "Không thể kết nối đến server", "error");
				setIsConnected(false);
				break;
			default:
				break;
		}
	}, []);

	useEffect(() => {
		if (isAuthenticated && user && token && isOpen) {
			aiChatBotSocket.addMessageHandler(handleSocketMessage);
			aiChatBotSocket.addConnectionHandler(handleSocketConnection);
			aiChatBotSocket.connect(token, user);
		}

		return () => {
			aiChatBotSocket.removeMessageHandler(handleSocketMessage);
			aiChatBotSocket.removeConnectionHandler(handleSocketConnection);
		};
	}, [
		isAuthenticated,
		user,
		token,
		isOpen,
		handleSocketMessage,
		handleSocketConnection,
	]);

	useEffect(() => {
		return () => {
			if (isOpen) {
				aiChatBotSocket.disconnect();
			}
		};
	}, [isOpen]);

	const handleSendMessage = useCallback(() => {
		if (!inputMessage.trim() || !isConnected || isLoading) return;

		if (inputMessage.length > MAX_MESSAGE_LENGTH) {
			showNotification(
				`Tin nhắn quá dài. Tối đa ${MAX_MESSAGE_LENGTH} ký tự.`,
				"warning"
			);
			return;
		}

		const userMessage = createUserMessage(inputMessage, user.id);

		if (!isValidMessage(userMessage)) {
			console.error("Invalid message format");
			return;
		}

		const messageWithTime = {
			...userMessage,
			timestamp: new Date().toISOString(),
			formattedTime: formatMessageTime(new Date().toISOString()),
		};

		setMessages((prev) => [...prev, messageWithTime]);
		setInputMessage("");
		setIsLoading(true);

		const success = aiChatBotSocket.sendMessageWithTyping(inputMessage);

		if (!success) {
			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					text: "Xin lỗi, có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.",
					sender: "bot",
					timestamp: new Date().toISOString(),
					formattedTime: formatMessageTime(new Date().toISOString()),
					error: true,
				},
			]);
		}

		setIsLoading(false);
	}, [inputMessage, isConnected, isLoading, user]);

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputMessage(value);

		if (value.length > MAX_MESSAGE_LENGTH * 0.8) {
			console.warn(
				`Approaching character limit: ${value.length}/${MAX_MESSAGE_LENGTH}`
			);
		}

		if (value.length > 0 && !isTyping) {
			aiChatBotSocket.setTypingStatus(true);
		} else if (value.length === 0 && isTyping) {
			aiChatBotSocket.setTypingStatus(false);
		}
	};

	const handleClearHistory = () => {
		if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?")) {
			aiChatBotSocket.clearChatHistory();
			setMessages([]);
			showNotification("Đã xóa lịch sử chat", "success");
		}
	};

	const handleExportConversation = () => {
		const exportData = aiChatBotSocket.exportConversation(messages);
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `chat-history-${new Date().toISOString().split("T")[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		showNotification("Đã xuất lịch sử chat", "success");
	};

	const toggleChat = () => {
		if (!isOpen) {
			if (showLabel) {
				setIsLabelFadingOut(true);
				setTimeout(() => {
					setIsOpen(true);
					setIsLabelFadingOut(false);
				}, 300);
			} else {
				setIsOpen(true);
			}
		} else {
			setIsOpen(false);
			const scrollY = window.scrollY;
			if (scrollY <= window.innerHeight) {
				setTimeout(() => {
					setShowLabel(true);
				}, 100);
			}
		}
	};

	const LoginPrompt = () => (
		<div className={cx("login-prompt")}>
			<div className={cx("login-icon")}>
				<svg
					width='48'
					height='48'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z'
						stroke='currentColor'
						strokeWidth='2'
					/>
					<path
						d='M21 21C21 17.134 16.971 14 12 14C7.029 14 3 17.134 3 21'
						stroke='currentColor'
						strokeWidth='2'
					/>
				</svg>
			</div>
			<h3>Đăng nhập để sử dụng AI Chatbot</h3>
			<p>
				Vui lòng đăng nhập để có thể trò chuyện với AI chatbot và lưu lại lịch sử chat
				của bạn.
			</p>
			<button
				className={cx("login-button")}
				onClick={() => (window.location.href = "/login")}
			>
				Đăng nhập ngay
			</button>
		</div>
	);

	const ChatInterface = () => (
		<div className={cx("chat-interface")}>
			<div className={cx("chat-header")}>
				<div className={cx("chat-title")}>
					<div className={cx("bot-avatar")}>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7C3 8.1 3.9 9 5 9H8V11C8 11.55 8.45 12 9 12H15C15.55 12 16 11.55 16 11V9H21Z'
								fill='currentColor'
							/>
						</svg>
					</div>
					<div>
						<h4>AI Assistant</h4>
						<span className={cx("status", {connected: isConnected})}>
							{isConnected ? (
								"Đã kết nối"
							) : (
								<div style={{display: "flex", alignItems: "center", gap: "6px"}}>
									<SpinnerLoading size='10px' />
									<span>Đang kết nối...</span>
								</div>
							)}
						</span>
					</div>
				</div>
				<div className={cx("chat-actions")}>
					<button
						className={cx("action-button")}
						onClick={handleClearHistory}
						title='Xóa lịch sử chat'
					>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M3 6H5H21'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
					<button
						className={cx("action-button")}
						onClick={handleExportConversation}
						title='Xuất lịch sử chat'
					>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M7 10L12 15L17 10'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M12 15V3'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</button>
					<button className={cx("close-button")} onClick={toggleChat}>
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M18 6L6 18M6 6L18 18'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
							/>
						</svg>
					</button>
				</div>
			</div>

			<div className={cx("messages-container")}>
				{messages.length === 0 ? (
					<div className={cx("welcome-message")}>
						<p>
							Xin chào {user?.fullName}! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn?
						</p>
					</div>
				) : (
					messages.map((message) => (
						<div key={message.id} className={cx("message", message.sender)}>
							<div className={cx("message-content")}>
								<p>{message.text}</p>
								<span className={cx("timestamp")}>
									{message.formattedTime || formatMessageTime(message.timestamp)}
								</span>
							</div>
						</div>
					))
				)}

				{isTyping && (
					<div className={cx("message", "bot")}>
						<div className={cx("message-content")}>
							<div className={cx("typing-indicator")}>
								<SpinnerLoading size='20px' />
								<span style={{marginLeft: "8px", fontSize: "14px", color: "#718096"}}>
									AI đang trả lời...
								</span>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<div className={cx("input-container")}>
				<textarea
					ref={inputRef}
					value={inputMessage}
					onChange={handleInputChange}
					onKeyPress={handleKeyPress}
					placeholder={`Nhập tin nhắn... (${inputMessage.length}/${MAX_MESSAGE_LENGTH})`}
					className={cx("message-input")}
					rows='1'
					disabled={!isConnected || isLoading}
				/>
				<button
					onClick={handleSendMessage}
					disabled={!inputMessage.trim() || !isConnected || isLoading}
					className={cx("send-button")}
				>
					{isLoading ? (
						<SpinnerLoading size='20px' />
					) : (
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);

	return (
		<div className={cx("popup-ai-chatbot")}>
			<button
				className={cx("chat-toggle", {active: isOpen})}
				onClick={toggleChat}
				aria-label='Toggle AI Chatbot'
			>
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
			</button>

			{showLabel && !isOpen && (
				<div className={cx("chat-label", {"fade-out": isLabelFadingOut})}>
					<div className={cx("label-text")}>QuyXanhChatBot</div>
					<div className={cx("label-subtext")}>power by deepseek</div>
				</div>
			)}

			{isOpen && (
				<div className={cx("chat-popup")}>
					{isAuthenticated ? <ChatInterface /> : <LoginPrompt />}
				</div>
			)}

			{notification && (
				<PopupNotification
					message={notification.message}
					type={notification.type}
					onClose={closeNotification}
				/>
			)}
		</div>
	);
}

export default PopupAIChatBot;
