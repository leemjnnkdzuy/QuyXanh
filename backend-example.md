# Backend WebSocket Server Example cho AI ChatBot

## Cấu trúc thư mục backend đề xuất:

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── websocketAuth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── ChatMessage.js
│   │   └── ChatSession.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── chatService.js
│   ├── utils/
│   │   ├── websocketManager.js
│   │   └── aiModelManager.js
│   └── app.js
├── package.json
└── README.md
```

## Cài đặt dependencies:

```json
{
	"dependencies": {
		"ws": "^8.14.2",
		"express": "^4.18.2",
		"jsonwebtoken": "^9.0.2",
		"mongoose": "^7.5.0",
		"cors": "^2.8.5",
		"dotenv": "^16.3.1",
		"@tensorflow/tfjs-node": "^4.10.0",
		"uuid": "^9.0.0"
	}
}
```

## Ví dụ WebSocket Server (app.js):

```javascript
const express = require("express");
const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
	process.env.MONGODB_URI || "mongodb://localhost:27017/ai_chatbot"
);

// Models
const ChatMessage = require("./src/models/ChatMessage");
const ChatSession = require("./src/models/ChatSession");

// Services
const AIService = require("./src/services/aiService");
const ChatService = require("./src/services/chatService");

// WebSocket Server
const wss = new WebSocket.Server({
	server,
	verifyClient: (info) => {
		const token = new URL(info.req.url, "http://localhost").searchParams.get(
			"token"
		);
		if (!token) return false;

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			info.req.user = decoded;
			return true;
		} catch (error) {
			return false;
		}
	},
});

// WebSocket Connection Handler
wss.on("connection", async (ws, req) => {
	const user = req.user;
	console.log(`User ${user.id} connected`);

	// Send chat history
	try {
		const history = await ChatService.getChatHistory(user.id);
		ws.send(
			JSON.stringify({
				type: "history",
				messages: history,
			})
		);
	} catch (error) {
		console.error("Error loading chat history:", error);
	}

	// Message handler
	ws.on("message", async (data) => {
		try {
			const message = JSON.parse(data);

			switch (message.type) {
				case "message":
					await handleUserMessage(ws, user, message);
					break;
				case "ping":
					ws.send(JSON.stringify({type: "pong"}));
					break;
				case "get_history":
					await handleGetHistory(ws, user);
					break;
				case "clear_history":
					await handleClearHistory(ws, user);
					break;
			}
		} catch (error) {
			console.error("Error handling message:", error);
			ws.send(
				JSON.stringify({
					type: "error",
					error: "Có lỗi xảy ra khi xử lý tin nhắn",
				})
			);
		}
	});

	ws.on("close", () => {
		console.log(`User ${user.id} disconnected`);
	});
});

// Handle user message
async function handleUserMessage(ws, user, message) {
	try {
		// Save user message
		const userMessage = await ChatService.saveMessage({
			userId: user.id,
			text: message.message,
			sender: "user",
			timestamp: new Date(),
		});

		// Send typing indicator
		ws.send(
			JSON.stringify({
				type: "typing",
				isTyping: true,
			})
		);

		// Get AI response
		const aiResponse = await AIService.generateResponse(message.message, user.id);

		// Save AI response
		const botMessage = await ChatService.saveMessage({
			userId: user.id,
			text: aiResponse,
			sender: "bot",
			timestamp: new Date(),
		});

		// Send AI response
		ws.send(
			JSON.stringify({
				type: "message",
				id: botMessage._id,
				message: aiResponse,
				timestamp: botMessage.timestamp,
			})
		);
	} catch (error) {
		console.error("Error handling user message:", error);
		ws.send(
			JSON.stringify({
				type: "error",
				error: "Có lỗi xảy ra khi xử lý tin nhắn",
			})
		);
	}
}

// Handle get history
async function handleGetHistory(ws, user) {
	try {
		const history = await ChatService.getChatHistory(user.id);
		ws.send(
			JSON.stringify({
				type: "history",
				messages: history,
			})
		);
	} catch (error) {
		console.error("Error getting chat history:", error);
		ws.send(
			JSON.stringify({
				type: "error",
				error: "Có lỗi xảy ra khi tải lịch sử chat",
			})
		);
	}
}

// Handle clear history
async function handleClearHistory(ws, user) {
	try {
		await ChatService.clearChatHistory(user.id);
		ws.send(
			JSON.stringify({
				type: "history",
				messages: [],
			})
		);
	} catch (error) {
		console.error("Error clearing chat history:", error);
		ws.send(
			JSON.stringify({
				type: "error",
				error: "Có lỗi xảy ra khi xóa lịch sử chat",
			})
		);
	}
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
```

## AI Service Example (src/services/aiService.js):

```javascript
const tf = require("@tensorflow/tfjs-node");

class AIService {
	constructor() {
		this.model = null;
		this.isInitialized = false;
		this.initializeModel();
	}

	async initializeModel() {
		try {
			// Load your local AI model here
			// Example: this.model = await tf.loadLayersModel('file://path/to/model.json');

			// For demo purposes, we'll use a simple response system
			this.isInitialized = true;
			console.log("AI Model initialized successfully");
		} catch (error) {
			console.error("Error initializing AI model:", error);
		}
	}

	async generateResponse(message, userId) {
		if (!this.isInitialized) {
			return "Xin lỗi, AI đang được khởi tạo. Vui lòng thử lại sau.";
		}

		// Simple response logic - replace with your actual AI model
		const responses = {
			"xin chào": "Xin chào! Tôi có thể giúp gì cho bạn?",
			"cảm ơn": "Không có gì! Tôi luôn sẵn sàng giúp đỡ.",
			"tạm biệt": "Tạm biệt! Hẹn gặp lại bạn lần sau.",
		};

		const lowerMessage = message.toLowerCase();

		// Check for predefined responses
		for (const [key, response] of Object.entries(responses)) {
			if (lowerMessage.includes(key)) {
				return response;
			}
		}

		// Default response or call to actual AI model
		return await this.callAIModel(message, userId);
	}

	async callAIModel(message, userId) {
		// Here you would call your local AI model
		// For example, using TensorFlow.js or calling Python script

		// Simulate AI processing time
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Return generated response
		return `Tôi hiểu bạn đang nói về: "${message}". Đây là phản hồi từ AI model địa phương.`;
	}
}

module.exports = new AIService();
```

## Chat Service Example (src/services/chatService.js):

```javascript
const ChatMessage = require("../models/ChatMessage");
const ChatSession = require("../models/ChatSession");

class ChatService {
	async saveMessage(messageData) {
		const message = new ChatMessage(messageData);
		return await message.save();
	}

	async getChatHistory(userId, limit = 50) {
		const messages = await ChatMessage.find({userId})
			.sort({timestamp: -1})
			.limit(limit)
			.exec();

		return messages.reverse().map((msg) => ({
			id: msg._id,
			text: msg.text,
			sender: msg.sender,
			timestamp: msg.timestamp,
		}));
	}

	async clearChatHistory(userId) {
		await ChatMessage.deleteMany({userId});
	}

	async createSession(userId) {
		const session = new ChatSession({
			userId,
			createdAt: new Date(),
			isActive: true,
		});
		return await session.save();
	}

	async getActiveSession(userId) {
		return await ChatSession.findOne({userId, isActive: true});
	}
}

module.exports = new ChatService();
```

## MongoDB Models:

### ChatMessage Model (src/models/ChatMessage.js):

```javascript
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	sender: {
		type: String,
		enum: ["user", "bot"],
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	metadata: {
		type: Object,
		default: {},
	},
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
```

### ChatSession Model (src/models/ChatSession.js):

```javascript
const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	lastActivity: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
```

## Chạy server:

```bash
npm install
npm start
```

Server sẽ chạy trên port 8080 và sẵn sàng nhận kết nối WebSocket từ frontend.

## Tính năng chính:

1. **Authentication**: Xác thực người dùng qua JWT token
2. **Real-time Communication**: WebSocket cho giao tiếp thời gian thực
3. **Message History**: Lưu và tải lịch sử chat cho từng user
4. **AI Integration**: Tích hợp AI model chạy local
5. **Error Handling**: Xử lý lỗi và thông báo cho client
6. **Reconnection**: Hỗ trợ kết nối lại tự động
