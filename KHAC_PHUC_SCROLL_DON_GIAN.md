# KHẮC PHỤC LỖI SCROLL - PHƯƠNG PHÁP ĐƠN GIẢN

## 🎯 MỤC TIÊU

**Bước 1:** Đảm bảo scroll cơ bản hoạt động (KHÔNG có sticky columns)
**Bước 2:** Sau khi scroll OK, thêm lại sticky columns từng bước

---

## 🔧 BẢN CẬP NHẬT MỚI (ĐƠNG GIẢN)

Tôi đã **TẠM THỜI TẮT** toàn bộ sticky columns CSS để test scroll cơ bản trước.

### Thay đổi:

1. **Đơn giản hóa .table-container:**
   - Loại bỏ `position: relative`
   - Set `max-height: 500px` (dễ test hơn)
   - Giữ `overflow-x: auto` và `overflow-y: auto`

2. **Đơn giản hóa table:**
   - Loại bỏ `position: relative`
   - Giữ `min-width: 800px` (desktop) / `600px` (mobile)

3. **Tắt sticky columns:**
   - Comment toàn bộ CSS `.sticky-col-1` và `.sticky-col-2`
   - Classes vẫn còn trong HTML nhưng không có effect

---

## 📝 HƯỚNG DẪN CẬP NHẬT

### BƯỚC 1: Cập nhật Styles.html

Mở file `Styles.html`, tìm section `/* ==================== TABLE ==================== */` (khoảng dòng 395).

**THAY THẾ** từ dòng 397 đến 442 bằng code sau:

```css
.table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  border-radius: var(--border-radius);
  background-color: var(--white-color);
  max-height: 500px;
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--dark-color);
}

thead th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: var(--white-color);
  background-color: var(--dark-color);
  white-space: nowrap;
}

tbody tr {
  border-bottom: 1px solid var(--light-color);
  transition: var(--transition);
}

tbody tr:hover {
  background-color: #f8f9fa;
}

tbody td {
  padding: 12px 15px;
  white-space: nowrap;
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-actions .btn {
  padding: 6px 10px;
  font-size: 12px;
}
```

---

### BƯỚC 2: Tắt sticky columns CSS

Tiếp tục trong cùng file, tìm section `/* ==================== STICKY COLUMNS (MOBILE) ==================== */`.

**THAY THẾ** toàn bộ section này bằng:

```css
/* ==================== STICKY COLUMNS (MOBILE) ==================== */

/* TEMPORARILY DISABLED - Testing scroll first */

/*
.sticky-col-1 {
  position: sticky !important;
  left: 0 !important;
  z-index: 5;
  background-color: var(--white-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

thead th.sticky-col-1 {
  z-index: 15;
  background-color: var(--dark-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

tbody tr:hover td.sticky-col-1 {
  background-color: #f8f9fa;
}

.sticky-col-2 {
  position: sticky !important;
  left: 100px !important;
  z-index: 4;
  background-color: var(--white-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

thead th.sticky-col-2 {
  z-index: 14;
  background-color: var(--dark-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

tbody tr:hover td.sticky-col-2 {
  background-color: #f8f9fa;
}
*/

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  /* Reduce table min-width on mobile */
  table {
    min-width: 600px;
  }
}
```

**Lưu ý:** Toàn bộ CSS sticky columns đã được COMMENT OUT (/* ... */)

---

### BƯỚC 3: Lưu và Deploy

1. **Lưu** file Styles.html (Ctrl + S)
2. **Deploy** lại webapp
3. **Hard refresh** trình duyệt (Ctrl + Shift + R)

---

## 🧪 TEST SCROLL CƠ BẢN

### Chuẩn bị:

1. **Mở DevTools** (F12)
2. **Toggle device toolbar** (Ctrl + Shift + M)
3. **Chọn device:** iPhone 12 Pro (390x844)

---

### TEST 1: Scroll ngang (QUAN TRỌNG NHẤT)

**Thực hiện:**
1. Vào **Trang chủ**
2. Scroll xuống phần "Giao dịch gần đây" (nếu có data)
3. **Vuốt ngang** trên bảng (hoặc dùng scrollbar)

**Kết quả mong đợi:**
- ✅ Bảng scroll ngang được
- ✅ Tất cả các cột cuộn theo
- ✅ **KHÔNG CÓ** cột nào cố định (do đã tắt sticky)

**Nếu KHÔNG scroll được:**
- Kiểm tra Console (F12 → Console) có lỗi không
- Kiểm tra Elements → `.table-container` → Computed styles:
  - `overflow-x: auto` ✓
  - `overflow-y: auto` ✓
- Kiểm tra `table` → Computed styles:
  - `min-width: 800px` (desktop) hoặc `600px` (mobile) ✓

---

### TEST 2: Scroll dọc

**Thực hiện:**
1. Nếu bảng có nhiều rows (> 10 rows)
2. Scroll dọc trong bảng

**Kết quả mong đợi:**
- ✅ Bảng scroll dọc được
- ✅ Header cố định ở top (do vẫn giữ `thead { position: sticky; top: 0; }`)
- ✅ Rows cuộn lên xuống

---

### TEST 3: Trang Tài khoản

**Thực hiện:**
1. Vào trang **Tài khoản**
2. Scroll ngang bảng **Quản lý tài khoản**
3. Scroll xuống, scroll ngang bảng **Lịch sử chuyển tiền**

**Kết quả mong đợi:**
- ✅ Cả 2 bảng đều scroll ngang được
- ✅ Cả 2 bảng đều scroll dọc được (nếu có nhiều data)
- ✅ Headers cố định khi scroll dọc

---

## 📊 SO SÁNH

### Trước đây (CÓ sticky columns):
- ❌ Không scroll ngang được
- ❌ Không scroll dọc được
- ❌ Position: sticky conflict với overflow

### Bây giờ (KHÔNG có sticky columns):
- ✅ Scroll ngang hoạt động
- ✅ Scroll dọc hoạt động
- ✅ Header vẫn sticky (position: sticky trên thead)
- ⚠️ Columns không cố định khi scroll ngang (tạm thời)

---

## 🚦 KẾT QUẢ TEST

### ✅ NẾU SCROLL HOẠT ĐỘNG:

**Báo cáo:** "Scroll ngang và dọc đã hoạt động!"

**Bước tiếp theo:**
- Tôi sẽ thêm lại sticky columns **TỪNG BƯỚC**
- Bắt đầu với chỉ 1 cột sticky
- Test sau mỗi bước để xác định đâu là vấn đề

### ❌ NẾU VẪN KHÔNG SCROLL:

**Báo cáo chi tiết:**
1. Trang nào không scroll? (Trang chủ / Tài khoản / Lịch sử?)
2. Scroll ngang hay dọc không hoạt động?
3. Console có lỗi gì không? (F12 → Console)
4. Computed styles của `.table-container`:
   - Overflow-x: ?
   - Overflow-y: ?
   - Max-height: ?
5. Computed styles của `table`:
   - Min-width: ?
   - Width: ?

---

## 🐛 DEBUG STEPS

Nếu vẫn không scroll, làm theo:

### Debug 1: Kiểm tra overflow

**Mở DevTools → Elements:**
1. Click vào bảng (table element)
2. Nhìn lên tìm `.table-container`
3. Tab **Computed**
4. Tìm `overflow-x` và `overflow-y`

**Phải là:**
- `overflow-x: auto`
- `overflow-y: auto`

**Nếu khác:**
- Có CSS nào đó override
- Tìm trong tab **Styles** xem CSS nào winning

---

### Debug 2: Kiểm tra table width

**Vẫn trong Elements:**
1. Click vào `<table>` element
2. Tab **Computed**
3. Xem `min-width` và `width`

**Mobile viewport (390px):**
- `min-width: 600px` ✓ (lớn hơn viewport → trigger scroll)
- `width: 600px` hoặc hơn ✓

**Nếu width = 390px:**
- Table đang shrink về viewport width
- CSS không apply hoặc bị override

---

### Debug 3: Kiểm tra parent

**Kiểm tra `.table-container`:**
1. Tab **Computed** → xem `width`
2. Phải là `390px` (bằng viewport)

**Kiểm tra `table`:**
1. Tab **Computed** → xem `width`
2. Phải là `600px` (min-width, lớn hơn container)

**Logic:**
```
Container width: 390px
Table min-width: 600px
→ Table overflow container
→ Horizontal scroll appears
```

---

## 💡 LƯU Ý

### 1. White-space: nowrap
- Đã thêm `white-space: nowrap` cho `tbody td`
- Đảm bảo content không wrap → Table đủ rộng

### 2. Max-height: 500px
- Cố định 500px để dễ test vertical scroll
- Nếu muốn cao hơn, đổi thành `calc(100vh - 250px)`

### 3. Sticky header vẫn hoạt động
- `thead { position: sticky; top: 0; }` vẫn giữ nguyên
- Header sẽ cố định khi scroll dọc

### 4. Classes sticky-col-* vẫn trong HTML
- Classes không bị xóa khỏi HTML
- Chỉ CSS bị comment out
- Khi uncomment CSS, sticky sẽ hoạt động ngay

---

## 🚀 NEXT STEPS

### Kịch bản 1: Scroll hoạt động ✅
1. Báo cho tôi biết: "Scroll đã OK!"
2. Tôi sẽ thêm lại sticky columns từng bước:
   - Bước 1: Chỉ sticky col-1 (cột đầu)
   - Test → OK?
   - Bước 2: Thêm sticky col-2 (cột thứ 2)
   - Test → OK?
   - Done!

### Kịch bản 2: Vẫn không scroll ❌
1. Báo chi tiết theo checklist trên
2. Tôi sẽ debug sâu hơn:
   - Có thể là browser compatibility
   - Có thể là CSS khác conflict
   - Có thể cần thay đổi approach (dùng wrapper khác)

---

**HẾT HƯỚNG DẪN KHẮC PHỤC**

Commit: `8e8467b`
Date: 2025-10-29
Version: Simplified (No sticky columns)
