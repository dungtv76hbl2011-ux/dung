# 📘 HƯỚNG DẪN TÍCH HỢP VÀ TEST PHASE 1

## 🎯 TỔNG QUAN PHASE 1

Phase 1 bao gồm:
- ✅ Hệ thống Login/Logout với mã hóa mật khẩu
- ✅ UI responsive, hiện đại với sidebar navigation
- ✅ Dashboard tổng quan với statistics
- ✅ Load toàn bộ dữ liệu 1 lần (client-side caching)
- ✅ 13 sheets với dữ liệu mẫu
- ✅ Hệ thống phân quyền Admin/User
- ✅ Modal notifications
- ✅ Sticky table headers

---

## 📁 DANH SÁCH FILES ĐÃ TẠO

### Backend (.gs files):
1. ✅ **Config.gs** - Cấu hình toàn hệ thống
2. ✅ **Utils.gs** - Các hàm tiện ích
3. ✅ **Database.gs** - Thao tác Sheets API v4
4. ✅ **Auth.gs** - Xác thực người dùng
5. ✅ **InitSetup.gs** - ⚠️ Tạo sheets & data (CHẠY 1 LẦN RỒI XÓA)
6. ✅ **Code.gs** - Main handler (doGet, routing)

### Frontend (.html files):
7. ✅ **Styles.html** - CSS toàn cục
8. ✅ **Login.html** - Trang đăng nhập
9. ✅ **Sidebar.html** - Menu sidebar
10. ✅ **Index.html** - Giao diện chính
11. ✅ **App.js.html** - JavaScript chính

---

## 🚀 BƯỚC 1: COPY CODE VÀO GOOGLE APPS SCRIPT

### 1.1. Mở Google Apps Script

1. Mở Google Sheet của bạn
2. Vào menu: **Extensions** → **Apps Script**
3. Xóa code mặc định trong file `Code.gs`

### 1.2. Tạo các file Backend (.gs)

**Thứ tự quan trọng:** Tạo theo đúng thứ tự này!

1. **Config.gs**
   - Click nút **+** bên cạnh "Files"
   - Chọn **Script** (.gs)
   - Đặt tên: `Config`
   - Copy toàn bộ nội dung từ file `/home/user/dung/Config.gs`
   - Paste vào
   - Ctrl+S để save

2. **Utils.gs**
   - Tạo file mới
   - Đặt tên: `Utils`
   - Copy code từ `/home/user/dung/Utils.gs`
   - Save

3. **Database.gs**
   - Tạo file mới
   - Đặt tên: `Database`
   - Copy code từ `/home/user/dung/Database.gs`
   - Save

4. **Auth.gs**
   - Tạo file mới
   - Đặt tên: `Auth`
   - Copy code từ `/home/user/dung/Auth.gs`
   - Save

5. **InitSetup.gs** ⚠️ (SẼ XÓA SAU)
   - Tạo file mới
   - Đặt tên: `InitSetup`
   - Copy code từ `/home/user/dung/InitSetup.gs`
   - Save

6. **Code.gs** (File đã có sẵn)
   - Chọn file `Code.gs` có sẵn
   - Xóa hết code cũ
   - Copy code từ `/home/user/dung/Code.gs`
   - Save

### 1.3. Tạo các file Frontend (.html)

**Tạo file HTML:**

1. **Styles.html**
   - Click nút **+** bên cạnh "Files"
   - Chọn **HTML**
   - Đặt tên: `Styles`
   - Copy code từ `/home/user/dung/Styles.html`
   - Save

2. **Login.html**
   - Tạo file HTML mới
   - Đặt tên: `Login`
   - Copy code từ `/home/user/dung/Login.html`
   - Save

3. **Sidebar.html**
   - Tạo file HTML mới
   - Đặt tên: `Sidebar`
   - Copy code từ `/home/user/dung/Sidebar.html`
   - Save

4. **Index.html**
   - Tạo file HTML mới
   - Đặt tên: `Index`
   - Copy code từ `/home/user/dung/Index.html`
   - Save

5. **App.js.html**
   - Tạo file HTML mới
   - Đặt tên: `App.js`
   - Copy code từ `/home/user/dung/App.js.html`
   - Save

---

## ⚡ BƯỚC 2: CHẠY HÀM KHỞI TẠO (1 LẦN DUY NHẤT)

### 2.1. Authorize ứng dụng

1. Trong Apps Script Editor
2. Chọn file **InitSetup.gs**
3. Ở dropdown function (trên toolbar), chọn: **initializeApp**
4. Click nút **Run** (▶️)
5. Popup hiện ra → Click **Review permissions**
6. Chọn tài khoản Google của bạn
7. Click **Advanced** → **Go to [Project Name] (unsafe)**
8. Click **Allow**

### 2.2. Chạy hàm khởi tạo

1. Sau khi authorize xong
2. Trong Apps Script, chọn function: **initializeApp**
3. Click **Run** (▶️)
4. Popup hiện ra trên Google Sheet: "Bạn có chắc chắn muốn tạo tất cả các sheet?"
5. Click **Yes**
6. Đợi 30-60 giây
7. Popup hiện: "✅ Khởi tạo thành công!"

### 2.3. Kiểm tra kết quả

Mở Google Sheet, bạn sẽ thấy 12 sheets mới:
- ✅ Thu nhập
- ✅ Chi tiêu
- ✅ Đầu tư
- ✅ Khoản vay
- ✅ Ngân sách
- ✅ Thu chi hộ
- ✅ Người dùng
- ✅ Tài khoản
- ✅ Ai_chat_history
- ✅ NOTIFICATIONS
- ✅ AUDIT_LOG
- ✅ Cài đặt

### 2.4. ⚠️ XÓA FILE InitSetup.gs

**QUAN TRỌNG:** Sau khi chạy thành công, XÓA file này!

1. Trong Apps Script Editor
2. Click chuột phải vào file **InitSetup.gs**
3. Chọn **Remove**
4. Xác nhận xóa

---

## 🌐 BƯỚC 3: DEPLOY WEB APP

### 3.1. Deploy

1. Trong Apps Script Editor
2. Click nút **Deploy** (góc trên bên phải)
3. Chọn **New deployment**
4. Click biểu tượng **⚙️ (Settings)** bên cạnh "Select type"
5. Chọn **Web app**
6. Cấu hình:
   - **Description:** Phase 1 - Login & Dashboard
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone with Google account (hoặc Anyone nếu muốn public)
7. Click **Deploy**
8. Popup hiện ra → Click **Authorize access**
9. Chọn tài khoản → Allow
10. Copy **Web app URL** (dạng: https://script.google.com/macros/s/xxx/exec)

### 3.2. Mở Web App

1. Paste URL vào trình duyệt
2. Bạn sẽ thấy trang Login đẹp mắt!

---

## 🧪 BƯỚC 4: TEST CHỨC NĂNG

### 4.1. Test Login

**Tài khoản Admin mặc định:**
- Username: `admin`
- Password: `admin123`

**Tài khoản User mặc định:**
- Username: `user1`
- Password: `user123`

**Test cases:**

✅ **TC1: Login thành công**
1. Nhập username: `admin`
2. Nhập password: `admin123`
3. Click "Đăng Nhập"
4. **Kết quả mong đợi:** Chuyển đến Dashboard, hiển thị thông tin user

✅ **TC2: Login thất bại - Sai password**
1. Nhập username: `admin`
2. Nhập password: `wrongpass`
3. Click "Đăng Nhập"
4. **Kết quả mong đợi:** Hiện modal "Mật khẩu không đúng"

✅ **TC3: Login thất bại - User không tồn tại**
1. Nhập username: `notexist`
2. Nhập password: `123`
3. Click "Đăng Nhập"
4. **Kết quả mong đợi:** Hiện modal "Tên đăng nhập không tồn tại"

✅ **TC4: Toggle password visibility**
1. Nhập password
2. Click icon 👁️ (eye)
3. **Kết quả mong đợi:** Password hiện ra dạng text
4. Click lại icon 👁️‍🗨️
5. **Kết quả mong đợi:** Password ẩn lại

### 4.2. Test Dashboard

✅ **TC5: Load dữ liệu**
1. Sau khi login thành công
2. **Kết quả mong đợi:**
   - Hiển thị 4 thẻ thống kê: Thu nhập, Chi tiêu, Tiết kiệm, Tổng tài sản
   - Thu nhập tháng này: 15,000,000₫
   - Chi tiêu tháng này: 130,000₫
   - Tiết kiệm: 14,870,000₫
   - Tổng tài sản: 42,000,000₫

✅ **TC6: Giao dịch gần đây**
1. Scroll xuống phần "Giao dịch gần đây"
2. **Kết quả mong đợi:**
   - Hiển thị bảng với 3 giao dịch
   - Sắp xếp theo ngày mới nhất

### 4.3. Test Navigation

✅ **TC7: Chuyển trang**
1. Click menu "Thu nhập" trên sidebar
2. **Kết quả mong đợi:**
   - Menu "Thu nhập" được highlight (màu cam)
   - Header title đổi thành "Thu nhập"
   - Content area hiển thị placeholder "Trang đang được phát triển"

3. Click các menu khác: Chi tiêu, Ngân sách, Khoản vay, etc.
4. **Kết quả mong đợi:** Tương tự, tất cả đều hiển thị placeholder

### 4.4. Test Logout

✅ **TC8: Đăng xuất**
1. Click nút "Đăng xuất" (góc trên bên phải)
2. Confirm dialog hiện ra
3. Click "OK"
4. **Kết quả mong đợi:** Redirect về trang Login

### 4.5. Test Responsive

✅ **TC9: Mobile view**
1. Mở DevTools (F12)
2. Chuyển sang mobile view (Ctrl+Shift+M)
3. **Kết quả mong đợi:**
   - Sidebar thu nhỏ (chỉ hiện icon)
   - Header title vẫn hiển thị
   - Content area full width

✅ **TC10: Tablet view**
1. Chuyển về tablet view (768px)
2. **Kết quả mong đợi:**
   - Layout responsive tự động điều chỉnh

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### ❌ Lỗi 1: "ReferenceError: getConfig is not defined"

**Nguyên nhân:** Chưa tạo file Config.gs hoặc chưa save

**Giải pháp:**
1. Kiểm tra file `Config.gs` có tồn tại không
2. Ctrl+S để save tất cả files
3. Refresh lại Apps Script Editor
4. Deploy lại

### ❌ Lỗi 2: "TypeError: Cannot read property 'SHEETS' of undefined"

**Nguyên nhân:** Function `getConfig()` không được gọi đúng

**Giải pháp:**
1. Mở file `Config.gs`
2. Kiểm tra function `getConfig()` có return đúng không
3. Save và deploy lại

### ❌ Lỗi 3: "Exception: Service Sheets failed"

**Nguyên nhân:** Chưa enable Google Sheets API

**Giải pháp:**
1. Trong Apps Script Editor
2. Click biểu tượng **+** bên cạnh "Services"
3. Tìm "Google Sheets API"
4. Chọn version: **v4**
5. Click "Add"

### ❌ Lỗi 4: Trang trắng khi mở web app

**Nguyên nhân:** Lỗi trong file HTML hoặc chưa deploy đúng

**Giải pháp:**
1. Mở DevTools (F12) → Console
2. Xem error message
3. Kiểm tra file `Index.html` và `Login.html`
4. Deploy lại: Deploy → Manage deployments → Pencil icon → Version: New version → Deploy

### ❌ Lỗi 5: "Không tìm thấy sheet: Thu nhập"

**Nguyên nhân:** Chưa chạy hàm `initializeApp()` hoặc sheet bị xóa

**Giải pháp:**
1. Mở file `InitSetup.gs`
2. Chạy lại function `initializeApp()`
3. Hoặc tạo lại sheets thủ công với đúng tên

### ❌ Lỗi 6: Login không hoạt động

**Nguyên nhân:** Chưa có dữ liệu users trong sheet "Người dùng"

**Giải pháp:**
1. Mở sheet "Người dùng"
2. Kiểm tra có dòng dữ liệu với username `admin` không
3. Nếu không có, chạy lại `initializeApp()`

---

## 📊 KIỂM TRA LOGS

### Xem Execution Logs

1. Trong Apps Script Editor
2. Click menu: **View** → **Execution log** (hoặc Ctrl+Enter)
3. Xem logs để debug

### Xem logs trong Browser

1. Mở web app
2. F12 → Console
3. Xem logs: "App initialized", "Data loaded successfully", etc.

---

## ✅ CHECKLIST HOÀN THÀNH PHASE 1

- [ ] Đã copy tất cả 11 files vào Apps Script
- [ ] Đã chạy `initializeApp()` thành công
- [ ] Đã xóa file `InitSetup.gs`
- [ ] Đã thấy 12 sheets trong Google Sheet
- [ ] Đã deploy web app
- [ ] Login với admin/admin123 thành công
- [ ] Dashboard hiển thị đúng số liệu
- [ ] Sidebar navigation hoạt động
- [ ] Logout hoạt động
- [ ] UI responsive trên mobile

---

## 📸 GỬI LỖI CHO CLAUDE

Nếu gặp lỗi, hãy gửi cho tôi:

### Cách 1: Chụp màn hình
- Chụp màn hình lỗi (toàn bộ cửa sổ)
- Copy ảnh (Ctrl+C)
- Paste vào chat (Ctrl+V)
- Mô tả: "Tôi gặp lỗi này khi [làm gì]"

### Cách 2: Copy error message
- Copy toàn bộ error message từ Console hoặc Execution log
- Paste vào chat
- Mô tả bước đang làm

### Thông tin cần thiết khi báo lỗi:
1. Đang test chức năng gì? (Login, Dashboard, etc.)
2. Các bước đã làm trước khi lỗi?
3. Error message chính xác?
4. Screenshot (nếu có)

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành Phase 1, bạn có:

✅ Webapp chạy ổn định với URL riêng
✅ Hệ thống login/logout bảo mật
✅ Dashboard hiển thị thống kê cơ bản
✅ UI đẹp, responsive
✅ 12 sheets với dữ liệu mẫu
✅ Foundation vững chắc cho các Phase tiếp theo

---

## ➡️ TIẾP THEO

Sau khi test Phase 1 thành công, báo cho tôi biết:
- ✅ "Phase 1 OK, bắt đầu Phase 2"

Hoặc nếu có lỗi:
- ❌ "Tôi gặp lỗi [mô tả] khi [làm gì]"

Tôi sẽ hỗ trợ debug và tiếp tục Phase 2: **Module Quản Lý Tài Khoản & Thanh Toán**

---

**Chúc bạn thành công! 🚀**
