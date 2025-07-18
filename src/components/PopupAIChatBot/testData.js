// Demo test data for AI ChatBot component
export const mockMessages = [
	{
		id: "msg_1",
		text: "Xin chào! Tôi có thể giúp gì cho bạn?",
		sender: "bot",
		timestamp: new Date(Date.now() - 300000).toISOString(),
	},
	{
		id: "msg_2",
		text: "Bạn có thể cho tôi biết về dự án QuyXanh không?",
		sender: "user",
		timestamp: new Date(Date.now() - 240000).toISOString(),
	},
	{
		id: "msg_3",
		text:
			"QuyXanh là một dự án về bảo vệ môi trường và phát triển bền vững. Dự án tập trung vào việc khuyến khích cộng đồng tham gia các hoạt động thân thiện với môi trường.",
		sender: "bot",
		timestamp: new Date(Date.now() - 180000).toISOString(),
	},
	{
		id: "msg_4",
		text: "Tôi có thể tham gia như thế nào?",
		sender: "user",
		timestamp: new Date(Date.now() - 120000).toISOString(),
	},
	{
		id: "msg_5",
		text:
			"Bạn có thể tham gia bằng cách:\n\n1. Đăng ký tài khoản trên website\n2. Tham gia các chiến dịch môi trường\n3. Chia sẻ thông tin với bạn bè\n4. Đóng góp ý kiến và đề xuất\n\nBạn có muốn tôi hướng dẫn chi tiết không?",
		sender: "bot",
		timestamp: new Date(Date.now() - 60000).toISOString(),
	},
];

export const mockUser = {
	id: "user_demo_123",
	fullName: "Nguyễn Văn A",
	email: "demo@example.com",
	avatar: null,
};

export const mockToken = "demo_jwt_token_12345";

// Mock WebSocket responses
export const mockWebSocketResponses = {
	greeting: {
		type: "message",
		message:
			"Xin chào! Tôi là AI Assistant của QuyXanh. Tôi có thể giúp gì cho bạn hôm nay?",
		timestamp: new Date().toISOString(),
	},

	about_project: {
		type: "message",
		message:
			"QuyXanh là một dự án về bảo vệ môi trường và phát triển bền vững. Chúng tôi tập trung vào việc khuyến khích cộng đồng tham gia các hoạt động thân thiện với môi trường như trồng cây, thu gom rác thải, và giáo dục môi trường.",
		timestamp: new Date().toISOString(),
	},

	how_to_join: {
		type: "message",
		message:
			"Để tham gia QuyXanh, bạn có thể:\n\n🌱 Đăng ký tài khoản miễn phí\n🌍 Tham gia các chiến dịch môi trường\n👥 Kết nối với cộng đồng\n📚 Học hỏi kiến thức về môi trường\n🎯 Đặt mục tiêu cá nhân\n\nBạn có muốn tôi hướng dẫn đăng ký không?",
		timestamp: new Date().toISOString(),
	},

	campaigns: {
		type: "message",
		message:
			"Hiện tại chúng tôi có các chiến dịch đang diễn ra:\n\n🌳 Trồng cây xanh - Mục tiêu: 1000 cây\n♻️ Thu gom rác thải - Tham gia hàng tuần\n🎓 Giáo dục môi trường - Khóa học online\n🌊 Bảo vệ nguồn nước - Chiến dịch toàn quốc\n\nBạn quan tâm đến chiến dịch nào?",
		timestamp: new Date().toISOString(),
	},

	contact: {
		type: "message",
		message:
			"Bạn có thể liên hệ với chúng tôi qua:\n\n📧 Email: info@quyxanh.com\n📱 Hotline: 1900-xxxx\n🌐 Website: quyxanh.com\n📍 Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM\n\nHoặc bạn có thể để lại thông tin, chúng tôi sẽ liên hệ lại!",
		timestamp: new Date().toISOString(),
	},

	default: {
		type: "message",
		message:
			"Cảm ơn bạn đã liên hệ! Tôi đã ghi nhận câu hỏi của bạn. Nếu cần hỗ trợ thêm, bạn có thể hỏi về:\n\n• Thông tin dự án QuyXanh\n• Cách tham gia chiến dịch\n• Đăng ký tài khoản\n• Liên hệ hỗ trợ\n\nHãy cho tôi biết bạn cần giúp gì nhé!",
		timestamp: new Date().toISOString(),
	},
};

// Mock AI response generator
export const generateMockAIResponse = (userMessage) => {
	const message = userMessage.toLowerCase();

	if (
		message.includes("xin chào") ||
		message.includes("hello") ||
		message.includes("hi")
	) {
		return mockWebSocketResponses.greeting;
	}

	if (
		message.includes("dự án") ||
		message.includes("quyxanh") ||
		message.includes("về")
	) {
		return mockWebSocketResponses.about_project;
	}

	if (
		message.includes("tham gia") ||
		message.includes("đăng ký") ||
		message.includes("làm thế nào")
	) {
		return mockWebSocketResponses.how_to_join;
	}

	if (
		message.includes("chiến dịch") ||
		message.includes("hoạt động") ||
		message.includes("campaign")
	) {
		return mockWebSocketResponses.campaigns;
	}

	if (
		message.includes("liên hệ") ||
		message.includes("contact") ||
		message.includes("hỗ trợ")
	) {
		return mockWebSocketResponses.contact;
	}

	return mockWebSocketResponses.default;
};

// Test scenarios
export const testScenarios = [
	{
		name: "Unauthenticated User",
		description: "Test chatbot behavior when user is not logged in",
		setup: {
			isAuthenticated: false,
			user: null,
			token: null,
		},
		expected: "Should show login prompt",
	},

	{
		name: "Authenticated User - First Time",
		description: "Test chatbot for first-time authenticated user",
		setup: {
			isAuthenticated: true,
			user: mockUser,
			token: mockToken,
			messages: [],
		},
		expected: "Should show welcome message and empty chat",
	},

	{
		name: "Authenticated User - With History",
		description: "Test chatbot with existing message history",
		setup: {
			isAuthenticated: true,
			user: mockUser,
			token: mockToken,
			messages: mockMessages,
		},
		expected: "Should load and display message history",
	},

	{
		name: "Connection Error",
		description: "Test chatbot behavior when WebSocket connection fails",
		setup: {
			isAuthenticated: true,
			user: mockUser,
			token: mockToken,
			connectionError: true,
		},
		expected: "Should show connection error and retry button",
	},

	{
		name: "Typing Indicator",
		description: "Test typing indicator functionality",
		setup: {
			isAuthenticated: true,
			user: mockUser,
			token: mockToken,
			isTyping: true,
		},
		expected: "Should show typing dots animation",
	},
];

// Performance test data
export const performanceTestData = {
	largeMessageHistory: Array.from({length: 100}, (_, i) => ({
		id: `msg_${i}`,
		text: `Test message ${i + 1} with some content to test scrolling performance`,
		sender: i % 2 === 0 ? "user" : "bot",
		timestamp: new Date(Date.now() - (100 - i) * 60000).toISOString(),
	})),

	longMessage: {
		id: "long_msg",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(50),
		sender: "bot",
		timestamp: new Date().toISOString(),
	},

	rapidMessages: Array.from({length: 20}, (_, i) => ({
		id: `rapid_${i}`,
		text: `Rapid message ${i + 1}`,
		sender: i % 2 === 0 ? "user" : "bot",
		timestamp: new Date(Date.now() - (20 - i) * 1000).toISOString(),
	})),
};

// Export default test configuration
const testData = {
	mockMessages,
	mockUser,
	mockToken,
	mockWebSocketResponses,
	generateMockAIResponse,
	testScenarios,
	performanceTestData,
};

export default testData;
