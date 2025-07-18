# Tài Liệu Website Landing Page QuyXanh

## 1. Tổng Quan Bố Cục Trang Chủ

### Cấu Trúc Chung

Website QuyXanh được xây dựng với kiến trúc Component-based React, bao gồm các phần chính:

```
📱 HomeHeader (Fixed Navigation)
📋 Content Sections:
  └── HeroSection (Hero Banner)
  └── StatsSection (Thống kê số liệu)
  └── FeaturesSection (Tính năng nổi bật)
  └── CompletedCampaignsSection (Chiến dịch hoàn thành)
  └── MainOdometerSection (Bộ đếm động)
  └── MapSection (Bản đồ tương tác)
  └── TrustSection (Phần tin cậy)
  └── HowItWorksSection (Cách thức hoạt động)
🦶 HomeFooter (Footer)
🎨 FloatingThemeToggle (Nút chuyển theme)
⬆️ UpToBeginToggle (Nút lên đầu trang)
```

### Kiến Trúc Responsive

- **Thiết Kế Desktop Đầu Tiên**: Tối ưu cho màn hình lớn
- **Responsive Di Động**: Tự động điều chỉnh cho thiết bị di động
- **Cải Tiến Dần Dần**: Tải nội dung theo mức độ ưu tiên

---

## 2. Tính Năng Chức Năng & Công Nghệ

### 🎨 Hệ Thống Theme (Dark/Light Mode)

- **Context API**: `ThemeContext` quản lý trạng thái toàn cục
- **LocalStorage**: Lưu trữ sở thích người dùng
- **Phát Hiện Hệ Thống**: Tự động phát hiện theme hệ thống
- **Chuyển Đổi Mượt Mà**: Chuyển đổi mượt mà giữa các theme

### 🌐 Đa Ngôn Ngữ (i18n)

- **React-i18next**: Framework quản lý ngôn ngữ
- **Tải Động**: Tải ngôn ngữ theo yêu cầu
- **Chuyển Đổi Ngữ Cảnh**: Chuyển đổi ngôn ngữ thời gian thực
- **Định Dạng Địa Phương**: Định dạng tiền tệ, ngày tháng theo vùng

### 💾 Quản Lý Phiên (Session Management)

- **AuthContext**: Quản lý trạng thái xác thực
- **Routes Được Bảo Vệ**: Bảo vệ các trang yêu cầu đăng nhập
- **Quản Lý Token**: Xử lý JWT tokens
- **Tự Động Đăng Xuất**: Tự động đăng xuất khi hết phiên

### 🔧 Stack Công Nghệ

```javascript
// Framework Cốt Lõi
React 19.1.0 + React Router DOM 7.6.2

// Styling & UI
SASS + CSS Modules + ClassNames
React Icons + Country Flag Icons

// Đồ Họa 3D & Bản Đồ
Three.js + React Three Fiber
React Simple Maps + TopoJSON

// Quản Lý State
Context API + Custom Hooks

// Animation & Effects
React Spring + Intersection Observer API

// Quốc Tế Hóa
i18next + React-i18next

// Phát Triển
TypeScript + React Scripts
```

---

## 3. HomeHeader, FloatingThemeToggle & UpToBeginToggle

### 🏠 HomeHeader Component

#### Chức Năng Chính

- **Hiển Thị Thích Ứng**:

  - Tự động ẩn/hiện header khi người dùng cuộn trang
  - Phát hiện khi đến MapSection để thay đổi kiểu dáng
  - Sử dụng vị trí cuộn thông minh với ngưỡng 100px
  - Kết hợp với `requestAnimationFrame` để tối ưu hiệu suất

- **Quản Lý Trạng Thái Xác Thực**:

  - Hiển thị menu khác nhau cho người dùng đã đăng nhập vs chưa đăng nhập
  - Tích hợp với AuthContext để theo dõi trạng thái đăng nhập
  - Hiển thị động các nút đăng nhập/đăng xuất
  - Dropdown hồ sơ người dùng với avatar và thông tin cá nhân

- **Hệ Thống Điều Hướng Di Động**:

  - Menu hamburger responsive cho thiết bị di động
  - Điều hướng overlay với hiệu ứng trượt mượt mà
  - Mục tiêu chạm thân thiện (tối thiểu 44px)
  - Hỗ trợ cử chỉ để vuốt đóng

- **Hỗ Trợ Đa Ngôn Ngữ**:
  - Dropdown chọn ngôn ngữ với cờ quốc gia
  - Chuyển đổi ngôn ngữ thời gian thực không reload trang
  - Lưu trữ sở thích ngôn ngữ trong localStorage
  - Chuẩn bị hỗ trợ RTL cho mở rộng tương lai

#### Điểm Đặc Biệt

- **Tối Ưu Hiệu Suất**: Sử dụng `requestAnimationFrame` để tối ưu sự kiện cuộn
- **Styling Động**: CSS classes thay đổi theo trạng thái cuộn
- **Mobile-First**: Menu responsive với animation mượt mà

### 🎨 FloatingThemeToggle Component

#### Chức Năng Chính

- **Hiển Thị Thông Minh Có Điều Kiện**:

  - Chỉ hiển thị component khi header bị ẩn để tránh xung đột
  - Sử dụng state `shouldRender` để điều khiển mounting/unmounting
  - Độ trễ timeout để tạo hiệu ứng chuyển tiếp mượt mà
  - Tối ưu bộ nhớ bằng cách dọn dẹp khi không cần thiết

- **Quản Lý Trạng Thái Theme**:

  - Kết nối trực tiếp với trạng thái toàn cục ThemeContext
  - Chuyển đổi theme thời gian thực với phản hồi trực quan ngay lập tức
  - Lưu trữ sở thích theme qua các phiên trình duyệt
  - Phát hiện theme hệ thống và đồng bộ tự động

- **Hệ Thống Animation Nâng Cao**:

  - Fade in/out nhiều giai đoạn với opacity và transform
  - Thời gian animation phân tầng cho cảm giác tự nhiên
  - CSS transitions với đường cong easing tùy chỉnh
  - Tăng tốc phần cứng với transform3d

- **Xuất Sắc Về Khả Năng Tiếp Cận**:
  - Nhãn ARIA toàn diện cho trình đọc màn hình
  - Hỗ trợ điều hướng bàn phím với quản lý focus
  - Khả năng tương thích chế độ tương phản cao
  - Tôn trọng reduced motion cho sở thích khả năng tiếp cận

#### Điểm Đặc Biệt

- **Hiển Thị Thông Minh**: Mounting có điều kiện để tối ưu hiệu suất
- **Animation Icon**: Icon Mặt trời/Mặt trăng với chuyển tiếp mượt mà
- **Chiến Lược Vị Trí**: Fixed positioning thông minh

### ⬆️ UpToBeginToggle Component

#### Chức Năng Chính

- **Phát Hiện Tiến Trình Cuộn Nâng Cao**:

  - Tính toán toán học dựa trên chiều cao tài liệu và chiều cao cửa sổ
  - Tính toán phần trăm chính xác với công thức: `(scrollTop + windowHeight) / documentHeight`
  - Ngưỡng thông minh 80% để tránh hiển thị sớm
  - Sự kiện cuộn debounced để tối ưu hiệu suất

- **Triển Khai Cuộn Mượt Mà**:

  - Cuộn mượt mà của trình duyệt gốc với `behavior: 'smooth'`
  - Hỗ trợ fallback cho các trình duyệt không hỗ trợ
  - Animation cuộn lên đầu với đường cong easing
  - Phản hồi trực quan trong quá trình cuộn

- **Phát Sóng Sự Kiện Tùy Chỉnh**:

  - Dispatch sự kiện tùy chỉnh `scrollToTop` cho giao tiếp giữa các component
  - Kiến trúc hướng sự kiện cho coupling lỏng lẻo
  - Quản lý event listeners toàn cục
  - Dọn dẹp sự kiện sạch sẽ để ngăn memory leaks

- **Chiến Lược Cải Tiến Dần Dần**:
  - Hoạt động mà không cần JavaScript được bật
  - Fallback chỉ CSS với hành vi cuộn mượt mà
  - Giảm dần graceful cho các trình duyệt cũ
  - Duy trì khả năng tiếp cận không cần JS

#### Điểm Đặc Biệt

- **Độ Chính Xác Toán Học**: Tính toán chính xác tiến trình cuộn
- **Phát Sóng Sự Kiện**: Sự kiện tùy chỉnh cho giao tiếp component
- **Tối Ưu UX**: Chỉ hiện khi thực sự cần thiết

---

## 4. HeroSection - Banner Chính

### 🎯 Chức Năng Chính

- **Nội Dung Động Thời Gian Thực**:

  - Tích hợp với hook useHomeData để lấy thống kê trực tiếp
  - Cập nhật nội dung tự động khi dữ liệu thay đổi từ API
  - Hiển thị có điều kiện dựa trên tính khả dụng của dữ liệu
  - Nội dung dự phòng cho trạng thái loading và xử lý lỗi

- **Định Dạng Tiền Tệ Nâng Cao**:

  - Định dạng tiền tệ đa locale với Intl.NumberFormat
  - Định dạng nhận biết ngữ cảnh theo ngôn ngữ hiện tại
  - Thay thế chuỗi template với placeholder i18n
  - Viết tắt số tự động (K, M, B) cho dễ đọc

- **Phần Tử Animation Tinh Xảo**:

  - Animation keyframe CSS cho các chấm bay
  - Độ trễ animation phân tầng cho sự hấp dẫn trực quan
  - Mô phỏng hệ thống hạt với CSS thuần túy
  - Transform tăng tốc phần cứng cho hiệu suất mượt mà

- **Thiết Kế Call-to-Action Chiến Lược**:
  - Nhiều nút CTA với phân cấp trực quan riêng biệt
  - Animation icon khi hover với React Icons
  - Vị trí và kích thước được tối ưu cho chuyển đổi
  - Cấu trúc component sẵn sàng cho A/B testing

### 💫 Điểm Đặc Biệt

- **Tích Hợp Dữ Liệu**: Kết nối với hook `useHomeData` để lấy thống kê thực tế
- **Hỗ Trợ Đa Ngôn Ngữ**: Chuỗi template với placeholder i18n
- **Hiệu Ứng Hình Ảnh**: Animation CSS cho các chấm bay
- **Typography Responsive**: Chia tỷ lệ font theo viewport

---

## 5. StatsSection - Thống Kê Số Liệu

### 📊 Chức Năng Chính

- **Tích Hợp Dữ Liệu Thời Gian Thực**:

  - Kết nối API trực tiếp với cơ chế làm mới tự động
  - Hỗ trợ WebSocket cho cập nhật thời gian thực
  - Chiến lược cache dữ liệu với invalidation thông minh
  - Xử lý lỗi với logic retry và exponential backoff

- **Trạng Thái Loading Thông Minh**:

  - Component Skeleton UI cho hiệu suất cảm nhận tốt hơn
  - Loading dần dần với việc lấy dữ liệu dựa trên ưu tiên
  - Hiệu ứng shimmer cho tính liên tục trực quan
  - Trạng thái lỗi graceful với thông báo thân thiện với người dùng

- **Định Dạng Tiền Tệ Nâng Cao**:

  - Định dạng số nhận biết locale với cân nhắc văn hóa
  - Vị trí ký hiệu tiền tệ động
  - Tự động chia tỷ lệ (K, M, B) với điều khiển độ chính xác
  - Khả năng chuyển đổi tỷ giá hối đoái thời gian thực

- **Tích Hợp Icon Toàn Diện**:
  - Ánh xạ icon semantic cho trực quan hóa dữ liệu
  - Tối ưu SVG với tree-shaking
  - Kích thước icon nhất quán và theming màu sắc
  - Thuộc tính khả năng tiếp cận cho trình đọc màn hình

### ⚡ Điểm Đặc Biệt

- **Hiển Thị Có Điều Kiện**: Hiển thị placeholder khi loading
- **Chuyển Đổi Dữ Liệu**: Chuyển đổi dữ liệu thô thành định dạng hiển thị
- **Hiệu Suất**: Memoization cho các tính toán tốn kém
- **Khả Năng Tiếp Cận**: Cấu trúc HTML semantic

### 🎭 Chiến Lược Animation

- **Animation Phân Tầng**: Mỗi stat có độ trễ khác nhau
- **Animation Bộ Đếm**: Số liệu đếm lên từ 0
- **Intersection Observer**: Kích hoạt animation khi cuộn vào view

---

## 6. FeaturesSection - Tính Năng Nổi Bật

### 🎨 Chức Năng Chính

- **Showcase Danh Mục Động**:

  - Hiển thị danh mục dựa trên dữ liệu từ cấu hình i18n
  - Thống kê danh mục thời gian thực với số lượng chiến dịch trực tiếp
  - Lọc và sắp xếp danh mục thông minh
  - Tích hợp chức năng tìm kiếm cho mở rộng tương lai

- **Thẻ Tương Tác Nâng Cao**:

  - Hiệu ứng hover đa lớp với CSS transforms
  - Animation lật thẻ 3D với perspective transforms
  - Tiết lộ dần dần thông tin khi tương tác
  - Hỗ trợ cử chỉ chạm cho thiết bị di động

- **Hệ Thống Icon Thống Nhất**:

  - Biểu tượng nhất quán trên tất cả danh mục
  - Tối ưu SVG sprite cho hiệu suất
  - Trạng thái animation icon (idle, hover, active)
  - Mã hóa màu semantic với tuân thủ khả năng tiếp cận

- **Lưới Responsive Thích Ứng**:
  - CSS Grid Layout với breakpoints thông minh
  - Hỗ trợ container query cho responsiveness cấp component
  - Tính toán cột động dựa trên nội dung
  - Tùy chọn layout masonry cho chiều cao nội dung khác nhau

### ✨ Điểm Đặc Biệt

- **Ánh Xạ Danh Mục**: Tạo nội dung động
- **Tương Tác Hover**: CSS transforms tinh xảo
- **Mã Hóa Màu**: Mỗi danh mục có scheme màu riêng
- **Tiết Lộ Dần Dần**: Phân cấp thông tin

---

## 7. CompletedCampaignsSection - Chiến Dịch Thành Công

### 🏆 Chức Năng Chính

- **Showcase Câu Chuyện Thành Công Hấp Dẫn**:

  - Điểm nổi bật chiến dịch được tuyển chọn với kể chuyện lấy con người làm trung tâm
  - Cấu trúc tường thuật trước/sau cho tác động cảm xúc
  - Metrics thành công dựa trên dữ liệu với bằng chứng trực quan
  - Định lượng tác động xã hội với kết quả có thể đo lường

- **Hệ Thống Thư Viện Ảnh Nâng Cao**:

  - Triển khai carousel tùy chỉnh với cuộn vô hạn
  - Lazy loading với intersection observer
  - Cải tiến ảnh dần dần với hỗ trợ WebP
  - Kích thước ảnh responsive với thuộc tính srcset

- **Theo Dõi Tiến Trình Tinh Xảo**:

  - Thanh tiến trình animated với hàm easing
  - Trực quan hóa hoàn thành mục tiêu thời gian thực
  - Theo dõi milestone đa giai đoạn
  - Phân tích tiến trình so sánh với dữ liệu lịch sử

- **Tích Hợp Bằng Chứng Xã Hội Chiến Lược**:
  - Carousel testimonial với câu chuyện người dùng đã xác minh
  - Chỉ số tin cậy với xác thực bên thứ ba
  - Thống kê tỷ lệ thành công với khoảng tin cậy
  - Trực quan hóa metrics tương tác cộng đồng

### 🌟 Điểm Đặc Biệt

- **Tối Ưu Ảnh**: Lazy loading và ảnh responsive
- **Logic Carousel**: Carousel tùy chỉnh với cuộn vô hạn
- **Trực Quan Hóa Dữ Liệu**: Thanh tiến trình sáng tạo
- **Kể Chuyện**: Tập trung vào câu chuyện con người

---

## 8. MainOdometerSection - Bộ Đếm Động (Hiển Thị Tổng Số Tiền Mà QuyXanh Đã Kêu Gọi Được)

### 🔢 Chức Năng Chính

- **Triển Khai Intersection Observer Nâng Cao**:

  - Phát hiện viewport chính xác với ngưỡng có thể cấu hình
  - Quan sát đa phần tử với tối ưu hiệu suất
  - Tính toán root margin cho thiết lập kích hoạt sớm
  - Quản lý dọn dẹp observer cho hiệu quả bộ nhớ

- **Engine Animation Odometer Tinh Xảo**:

  - Animation cuộn chữ số tùy chỉnh với vật lý thực tế
  - Thời lượng quay ngẫu nhiên cho cảm giác tự nhiên
  - Nội suy mượt mà với requestAnimationFrame
  - Hiển thị tối ưu hiệu suất với thao tác DOM tối thiểu

- **Pipeline Tích Hợp Dữ Liệu Trực Tiếp**:

  - Kết nối API thời gian thực với WebSocket fallback
  - Lớp xác thực và sanitization dữ liệu
  - Cơ chế phục hồi lỗi với degradation graceful
  - Chiến lược caching với khoảng thời gian làm mới thông minh

- **Hệ Thống Giám Sát Hiệu Suất**:
  - Giám sát frame rate animation
  - Theo dõi sử dụng bộ nhớ cho số lớn
  - Tối ưu sử dụng CPU với cập nhật debounced
  - Chia tỷ lệ animation nhận biết pin cho thiết bị di động

### ⚙️ Điểm Đặc Biệt

- **Phát Hiện Tầm Nhìn**: Chỉ animate khi người dùng nhìn thấy
- **Quản Lý Bộ Nhớ**: Dọn dẹp observers khi unmount
- **Animation Mượt Mà**: RequestAnimationFrame cho 60fps
- **Hỗ Trợ Fallback**: Degradation graceful

---

## 9. MapSection - Bản Đồ Tương Tác

### 🗺️ Chức Năng Chính

- **Hiển Thị Bản Đồ Việt Nam Tương Tác**:

  - Bản đồ vector dựa trên SVG với đồ họa có thể mở rộng
  - Liên kết dữ liệu tỉnh thời gian thực với mã hóa màu
  - Trực quan hóa dữ liệu đa lớp (chiến dịch, quyên góp, người dùng)
  - Tối ưu dữ liệu địa lý với nén TopoJSON

- **Hệ Thống Tương Tác Tỉnh Nâng Cao**:

  - Quản lý trạng thái hover với sự kiện debounced
  - Xử lý click với thông tin tỉnh chi tiết
  - Hỗ trợ đa chạm cho điều hướng bản đồ di động
  - Khả năng tiếp cận bàn phím với điều hướng phím mũi tên

- **Trực Quan Hóa Dữ Liệu Động**:

  - Tô màu heat map dựa trên mật độ chiến dịch
  - Ký hiệu phân cấp cho số tiền quyên góp
  - Animation dữ liệu chuỗi thời gian cho xu hướng lịch sử
  - Phân tích so sánh với mức trung bình quốc gia

- **Hệ Thống Thông Tin Tooltip Phong Phú**:
  - Định vị tooltip nhận biết ngữ cảnh
  - Hiển thị dữ liệu đa metric trong tooltips
  - Kích thước tooltip responsive theo nội dung
  - Hành vi tooltip tuân thủ khả năng tiếp cận

### 🎯 Điểm Đặc Biệt

- **React Simple Maps**: Hiển thị bản đồ dựa trên SVG
- **Dữ Liệu TopoJSON**: Dữ liệu địa lý được tối ưu
- **Tooltips Tùy Chỉnh**: Component có thể tái sử dụng
- **Hiệu Suất**: Virtualization cho bộ dữ liệu lớn

### 🎨 Tính Năng Hình Ảnh

- **Gradient Màu Sắc**: Mã hóa trực quan dữ liệu
- **Chuyển Tiếp Mượt Mà**: CSS transitions cho trạng thái hover
- **Thiết Kế Responsive**: Chia tỷ lệ bản đồ theo viewport
- **Khả Năng Tiếp Cận**: Hỗ trợ điều hướng bàn phím

---

## 10. TrustSection - Phần Xây Dựng Niềm Tin

### 🛡️ Chức Năng Chính

- **Scroll-driven Animation System**:

  - Sử dụng scroll progress để điều khiển 3 phase: header, features, cta
  - Tính toán scroll progress dựa trên viewport và container height
  - Sticky section behavior với parallax background effects
  - Smooth phase transitions với progress-based animations

- **Parallax Background & Floating Particles**:

  - 3 background shapes với parallax movement
  - 6 floating particles với icons (FiStar, FaHeart, FaUsers)
  - CSS custom properties để bind scroll progress
  - Hardware-accelerated transforms cho smooth performance

- **Progressive Content Disclosure**:

  - **Phase 1 (Header)**: Badge "Đáng tin cậy & An toàn", title với highlight text
  - **Phase 2 (Features)**: 4 trust features grid với icons và descriptions
  - **Phase 3 (CTA)**: Call-to-action buttons với "Tạo chiến dịch ngay"

- **Trust Features Showcase**:
  - **Miễn phí**: "Không phí để bắt đầu" với FiDollarSign icon
  - **Bảo mật**: "Bảo mật thông tin 100%" với FiShield icon
  - **Hỗ trợ**: "Hỗ trợ 24/7" với FiClock icon
  - **Minh bạch**: "Minh bạch tài chính" với FiTrendingUp icon

### 💎 Điểm Đặc Biệt

- **Dynamic Phase Management**: Tự động chuyển phase dựa trên scroll position
- **Intersection Observer**: Detect visibility cho animation triggers
- **CSS Custom Properties**: Sử dụng --scroll-progress và --current-phase
- **Optimized Event Listeners**: Passive scroll events với performance optimization

---

## 11. HowItWorksSection - Hướng Dẫn Sử Dụng

### 📝 Chức Năng Chính

- **Simple 3-Step Process**:

  - **Bước 1**: "Sử dụng công cụ của chúng tôi để tạo chiến dịch"

    - Icon: FaMobile
    - Description: Hướng dẫn chi tiết chiến dịch và đặt mục tiêu
    - CTA: "Lấy mẹo để bắt đầu chiến dịch của bạn"

  - **Bước 2**: "Tiếp cận người ủng hộ bằng cách chia sẻ"

    - Icon: FaGlobe
    - Description: Chia sẻ liên kết và sử dụng tài nguyên dashboard

  - **Bước 3**: "Nhận tiền một cách an toàn"
    - Icon: FiShield
    - Description: Bảo vệ quyên góp an toàn và minh bạch

- **Minimalist Design Approach**:

  - Clean step numbering với visual hierarchy
  - Icon-driven visual communication
  - Focus vào actionable content thay vì complex interactions
  - Mobile-first responsive layout

### 🎓 Điểm Đặc Biệt

- **Practical Focus**: Tập trung vào hành động cụ thể thay vì theory
- **Trust-building**: Mỗi step nhấn mạnh tính an toàn và hỗ trợ
- **Clear Value Proposition**: Từng bước thể hiện giá trị rõ ràng
- **Simple Implementation**: Không có complex animations, focus vào content clarity

---

## 🎯 Kết Luận

Website QuyXanh được xây dựng với kiến trúc hiện đại, tập trung vào:

### ✅ Điểm Mạnh Chính

- **Hiệu Suất**: Tối ưu tải và hiển thị
- **UX/UI**: Thiết kế trực quan, dễ sử dụng
- **Khả Năng Tiếp Cận**: Hỗ trợ đầy đủ cho người khuyết tật
- **Quốc Tế Hóa**: Đa ngôn ngữ hoàn chỉnh
- **Responsive**: Hoạt động tốt trên mọi thiết bị
- **Khả Năng Bảo Trì**: Cấu trúc code dễ bảo trì

### 🔧 Công Nghệ Hiện Đại

- React 19 với Hooks và Context API
- CSS Modules + SASS cho styling
- Three.js cho đồ họa 3D
- i18next cho đa ngôn ngữ
- Chiến lược tối ưu hiệu suất

### 🚀 Tương Lai

- Progressive Web App (PWA)
- Thông báo thời gian thực
- Phân tích nâng cao
- Đề xuất được hỗ trợ AI
- Trải nghiệm di động nâng cao
