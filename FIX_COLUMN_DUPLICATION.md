# Khắc Phục Lỗi Cột Bị Duplicate

## Vấn đề
Cột "Ngày" trong bảng giao dịch gần đây xuất hiện **2 lần**, khiến header không khớp với data columns khi scroll ngang.

## Nguyên nhân
Các class `sticky-col-1` và `sticky-col-2` vẫn còn trong HTML mặc dù CSS đã bị comment out, gây ra visual duplication.

## Giải pháp
Xóa tất cả các class `sticky-col-1` và `sticky-col-2` khỏi HTML code.

---

## Chi tiết thay đổi

### 1. App.js.html (line 179)
**Trước:**
```javascript
<td class="sticky-col-1">${tx.date}</td>
```

**Sau:**
```javascript
<td>${tx.date}</td>
```

### 2. Index.html (line 147)
**Trước:**
```html
<th class="sticky-col-1">Ngày</th>
```

**Sau:**
```html
<th>Ngày</th>
```

### 3. Accounts.html

#### 3.1. Bảng Quản lý tài khoản - Headers (lines 59-60)
**Trước:**
```html
<th class="sticky-col-1">Loại</th>
<th class="sticky-col-2">Tên tài khoản</th>
```

**Sau:**
```html
<th>Loại</th>
<th>Tên tài khoản</th>
```

#### 3.2. Bảng Quản lý tài khoản - Data cells (lines 193, 199)
**Trước:**
```javascript
<td class="sticky-col-1">...</td>
<td class="sticky-col-2">...</td>
```

**Sau:**
```javascript
<td>...</td>
<td>...</td>
```

#### 3.3. Lịch sử chuyển tiền - Header (line 104)
**Trước:**
```html
<th class="sticky-col-1">Thời gian</th>
```

**Sau:**
```html
<th>Thời gian</th>
```

#### 3.4. Lịch sử chuyển tiền - Data cell (line 757)
**Trước:**
```javascript
<td class="sticky-col-1">${dateStr}</td>
```

**Sau:**
```javascript
<td>${dateStr}</td>
```

---

## Kết quả mong đợi

Sau khi deploy lại code:

### ✅ Trang chủ - Giao dịch gần đây
- Cột "Ngày" chỉ xuất hiện **1 lần**
- Headers khớp hoàn toàn với data columns
- Scroll ngang hoạt động bình thường
- Không còn misalignment

### ✅ Trang Tài khoản - Quản lý tài khoản
- Cột "Loại" và "Tên tài khoản" chỉ xuất hiện **1 lần**
- Headers khớp với data
- Scroll ngang hoạt động bình thường

### ✅ Trang Tài khoản - Lịch sử chuyển tiền
- Cột "Thời gian" chỉ xuất hiện **1 lần**
- Headers khớp với data
- Scroll ngang hoạt động bình thường

---

## Hướng dẫn test

1. **Deploy lại code** lên Google Apps Script
2. **Xóa cache** browser (Ctrl+F5 hoặc Cmd+Shift+R)
3. **Kiểm tra từng trang:**

### Test Trang chủ:
- Vào trang chủ
- Scroll ngang bảng "Giao dịch gần đây"
- Kiểm tra: Cột "Ngày" chỉ có **1 cột**, không bị duplicate
- Kiểm tra: Headers khớp với data

### Test Trang Tài khoản - Quản lý:
- Vào trang Tài khoản
- Scroll ngang bảng "Quản lý Tài khoản"
- Kiểm tra: Cột "Loại" và "Tên tài khoản" mỗi cột chỉ có **1 lần**
- Kiểm tra: Headers khớp với data

### Test Trang Tài khoản - Lịch sử:
- Vào trang Tài khoản
- Scroll ngang bảng "Lịch sử chuyển tiền"
- Kiểm tra: Cột "Thời gian" chỉ có **1 cột**
- Kiểm tra: Headers khớp với data

---

## Bước tiếp theo

Sau khi confirm lỗi duplicate đã được fix và headers đã khớp với data:

### Có thể thêm lại tính năng Sticky Columns:

1. **Uncomment CSS** trong Styles.html (lines 466-503)
2. **Thêm lại các class** vào HTML như trước
3. **Test kỹ** để đảm bảo:
   - Sticky columns hoạt động đúng
   - Không gây duplicate
   - Headers vẫn khớp với data
   - Scroll ngang vẫn hoạt động

**Lưu ý:** Chỉ thêm sticky columns **SAU KHI** confirm header alignment đã hoàn toàn ổn định.

---

## Commit info
- **Commit:** 880f91c
- **Branch:** claude/session-011CUZMumNLCnKxpcwTUBy9w
- **Files changed:** App.js.html, Index.html, Accounts.html
