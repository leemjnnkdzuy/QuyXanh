# AI ChatBot Component

## Tổng quan

Component AI ChatBot là một chatbot thông minh được tích hợp vào website, cho phép người dùng tương tác với AI model thông qua giao diện chat thời gian thực.

## Tính năng chính

### 1. Xác thực người dùng

- Yêu cầu đăng nhập để sử dụng chatbot
- Hiển thị form đăng nhập cho người dùng chưa xác thực
- Tích hợp với hệ thống auth hiện có

### 2. Giao tiếp thời gian thực

- Sử dụng WebSocket để giao tiếp với backend
- Hiển thị trạng thái typing indicator
- Kết nối tự động và reconnect khi mất kết nối

### 3. Lưu trữ lịch sử chat

- Lưu lại tất cả tin nhắn cho từng user
- Tải lịch sử chat khi mở chatbot
- Chatbot hiểu được context của cuộc trò chuyện

### 4. AI Model địa phương

- Tích hợp với AI model chạy trên server local
- Xử lý tin nhắn và trả về phản hồi thông minh
- Hỗ trợ context awareness

## Cấu trúc file

```
src/
├── components/
│   └── PopupAIChatBot/
│       ├── index.jsx                 # Component chính
│       └── PopupAIChatBot.module.scss # Styles
├── utils/
│   ├── aiChatBotSocket.jsx           # WebSocket manager
│   └── chatHelpers.js                # Helper functions
└── pages/
    └── Home/
        └── index.jsx                 # Tích hợp vào trang chủ
```

## Cài đặt và sử dụng

### 1. Import và sử dụng component

```jsx
import PopupAIChatBot from "../../components/PopupAIChatBot";

function Home() {
	return (
		<div>
			{/* Nội dung trang */}
			<PopupAIChatBot />
		</div>
	);
}
```

### 2. Cấu hình WebSocket URL

Trong `src/utils/aiChatBotSocket.jsx`, cập nhật URL của WebSocket server:

```javascript
const wsUrl = `ws://localhost:8080/ws/chat?token=${encodeURIComponent(
	token
)}&userId=${encodeURIComponent(user.id)}`;
```

### 3. Tích hợp với hệ thống auth

Component sử dụng `useAuth` hook để lấy thông tin user và token:

```jsx
const {isAuthenticated, user, token} = useAuth();
```

## API WebSocket

### Tin nhắn gửi đi (Client → Server)

```javascript
// Gửi tin nhắn
{
  type: 'message',
  message: 'Nội dung tin nhắn',
  userId: 'user_id',
  timestamp: '2024-01-01T00:00:00.000Z'
}

// Ping/Pong heartbeat
{
  type: 'ping'
}

// Yêu cầu lịch sử chat
{
  type: 'get_history',
  userId: 'user_id'
}

// Xóa lịch sử chat
{
  type: 'clear_history',
  userId: 'user_id'
}
```

### Tin nhắn nhận được (Server → Client)

```javascript
// Tin nhắn từ bot
{
  type: 'message',
  id: 'message_id',
  message: 'Phản hồi từ AI',
  timestamp: '2024-01-01T00:00:00.000Z',
  metadata: {}
}

// Typing indicator
{
  type: 'typing',
  isTyping: true
}

// Lịch sử chat
{
  type: 'history',
  messages: [
    {
      id: 'msg_id',
      text: 'Nội dung',
      sender: 'user|bot',
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  ]
}

// Lỗi
{
  type: 'error',
  error: 'Mô tả lỗi'
}
```

## Styling

Component sử dụng SCSS modules với các tính năng:

- Responsive design
- Dark mode support
- Smooth animations
- Custom scrollbar
- Gradient themes

### Tùy chỉnh theme

```scss
// Tùy chỉnh màu chính
.chat-toggle {
	background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}

// Tùy chỉnh header
.chat-header {
	background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}
```

## Xử lý lỗi

Component có các cơ chế xử lý lỗi:

1. **Connection errors**: Hiển thị trạng thái kết nối
2. **Message sending errors**: Thông báo lỗi và retry
3. **Authentication errors**: Redirect về login
4. **Network errors**: Auto-reconnect với backoff

## Performance

### Optimizations đã áp dụng:

- `useCallback` cho event handlers
- `useMemo` cho computed values
- Virtual scrolling cho tin nhắn nhiều
- Debounce cho typing indicator
- Connection pooling cho WebSocket

### Best practices:

- Limit message history (50 messages)
- Message length limit (1000 characters)
- Auto-disconnect khi không active
- Cleanup resources on unmount

## Testing

### Unit Tests

```bash
npm test -- --testPathPattern=PopupAIChatBot
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Troubleshooting

### Common Issues:

1. **WebSocket không kết nối được**

   - Kiểm tra URL WebSocket server
   - Verify token authentication
   - Check network connectivity

2. **Messages không hiển thị**

   - Check message format
   - Verify user authentication
   - Debug WebSocket messages

3. **Styling issues**
   - Clear browser cache
   - Check SCSS compilation
   - Verify CSS modules

### Debug mode:

```javascript
// Enable debug logging
window.DEBUG_CHATBOT = true;
```

## Roadmap

### Upcoming features:

- [ ] File upload support
- [ ] Voice message integration
- [ ] Message reactions
- [ ] Chat export functionality
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Emoji picker
- [ ] Message search
- [ ] Notification system

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License - see LICENSE file for details.
