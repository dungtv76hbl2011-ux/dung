# FIX LỖI KHÔNG SCROLL ĐƯỢC TRÊN MOBILE

## 🐛 VẤN ĐỀ

Sau khi thêm sticky columns, các bảng không thể scroll ngang và dọc trên mobile.

**Nguyên nhân:**
1. Table `min-width: 100%` (bằng container width) → không trigger horizontal scroll
2. Position sticky conflict với overflow trong một số trình duyệt
3. Sticky columns không có min-width → có thể collapse
4. CSS conflict do thiếu `!important`

---

## 🔧 GIẢI PHÁP

### BƯỚC 1: Cập nhật Styles.html

Mở file `Styles.html` và tìm section `/* ==================== TABLE ==================== */` (khoảng dòng 395).

**THAY THẾ** từ dòng 397 đến 445 bằng code sau:

```css
.table-container {
  overflow-x: auto;
  overflow-y: auto;
  border-radius: var(--border-radius);
  background-color: var(--white-color);
  max-height: calc(100vh - 250px);
  position: relative;
  /* Enable smooth scrolling */
  -webkit-overflow-scrolling: touch;
}

table {
  width: 100%;
  min-width: 800px; /* Force table to be wide enough to trigger horizontal scroll on mobile */
  border-collapse: collapse;
  font-size: 14px;
  position: relative;
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
  position: relative;
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
  position: relative;
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

### BƯỚC 2: Cập nhật Sticky Columns CSS

Tiếp tục trong cùng file `Styles.html`, tìm section `/* ==================== STICKY COLUMNS (MOBILE) ==================== */` (khoảng dòng 450).

**THAY THẾ** toàn bộ section này (từ dòng 458 đến 516) bằng code sau:

```css
/* ==================== STICKY COLUMNS (MOBILE) ==================== */

/* Sticky first column (e.g., Date, Time, Type) */
.sticky-col-1 {
  position: sticky !important;
  left: 0 !important;
  z-index: 5;
  background-color: var(--white-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  min-width: 100px;
  white-space: nowrap;
}

/* Header sticky first column needs higher z-index */
thead th.sticky-col-1 {
  z-index: 15;
  background-color: var(--dark-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

/* Hover state for sticky column in tbody */
tbody tr:hover td.sticky-col-1 {
  background-color: #f8f9fa;
}

/* Sticky second column (e.g., Account Name) */
.sticky-col-2 {
  position: sticky !important;
  left: 100px !important; /* Matches first column min-width */
  z-index: 4;
  background-color: var(--white-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  min-width: 140px;
  white-space: nowrap;
}

/* Header sticky second column */
thead th.sticky-col-2 {
  z-index: 14;
  background-color: var(--dark-color);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

/* Hover state for sticky second column */
tbody tr:hover td.sticky-col-2 {
  background-color: #f8f9fa;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  /* Reduce table min-width on mobile */
  table {
    min-width: 600px;
  }

  /* Make first sticky column narrower on mobile */
  .sticky-col-1 {
    min-width: 80px;
    max-width: 100px;
  }

  /* Adjust second column position and width */
  .sticky-col-2 {
    left: 80px !important;
    min-width: 100px;
    max-width: 140px;
  }
}
```

---

### BƯỚC 3: Lưu và Deploy

1. **Lưu file** Styles.html (Ctrl + S)
2. **Deploy lại** webapp
3. **Hard refresh** trình duyệt (Ctrl + Shift + R)

---

## 🚀 TEST TRÊN MOBILE

### Cách test:

1. **Mở DevTools** (F12)
2. **Toggle device toolbar** (Ctrl + Shift + M)
3. **Chọn device**: iPhone 12 hoặc Pixel 5

### Test Case 1: Scroll ngang

**Thực hiện:**
- Vào trang chủ / trang Tài khoản
- Vuốt ngang trên bảng (hoặc dùng scrollbar)

**Kết quả mong đợi:**
- ✅ Bảng scroll ngang được
- ✅ Cột đầu tiên (sticky) cố định bên trái
- ✅ Cột thứ 2 (nếu có) cố định tiếp theo
- ✅ Các cột khác cuộn theo

### Test Case 2: Scroll dọc

**Thực hiện:**
- Scroll dọc trong bảng (nếu có nhiều rows)

**Kết quả mong đợi:**
- ✅ Bảng scroll dọc được
- ✅ Header cố định ở top
- ✅ Rows cuộn lên xuống bình thường

### Test Case 3: Scroll đồng thời

**Thực hiện:**
- Scroll ngang rồi scroll dọc
- Hoặc scroll dọc rồi scroll ngang

**Kết quả mong đợi:**
- ✅ Cả 2 hướng scroll hoạt động độc lập
- ✅ Sticky header và sticky columns vẫn giữ vị trí
- ✅ Không bị lag hoặc jump

---

## 📝 CÁC THAY ĐỔI CHI TIẾT

### 1. Table dimensions:
- ❌ **Cũ:** `min-width: 100%` (không scroll)
- ✅ **Mới:** `min-width: 800px` (desktop), `600px` (mobile)
- ➕ **Thêm:** `position: relative`

### 2. Sticky columns:
- ➕ **Thêm:** `!important` cho `position` và `left`
- ➕ **Thêm:** `min-width: 100px` (col-1), `140px` (col-2)
- ➕ **Thêm:** `white-space: nowrap`
- 🔧 **Sửa:** `.sticky-col-2` left từ `120px` → `100px`

### 3. Scroll enhancements:
- ➕ **Thêm:** `-webkit-overflow-scrolling: touch` (iOS smooth scroll)
- ➕ **Thêm:** `position: relative` cho thead th
- ❌ **Xóa:** `white-space: nowrap` từ tbody td

### 4. Mobile responsive:
- ➕ **Thêm:** Media query để override table min-width
- 🔧 **Sửa:** Sticky columns width trên mobile

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Vẫn không scroll ngang được

**Kiểm tra:**
1. File Styles.html đã lưu chưa?
2. Deploy lại chưa?
3. Hard refresh (Ctrl + Shift + R)?
4. Console có lỗi CSS không? (F12 → Console)

**Debug:**
- Mở DevTools → Elements
- Tìm `.table-container`
- Kiểm tra computed styles: `overflow-x: auto`, `overflow-y: auto`
- Tìm `table`
- Kiểm tra computed styles: `min-width: 800px` (desktop) hoặc `600px` (mobile)

### Vấn đề 2: Sticky columns không cố định

**Kiểm tra:**
1. Các `<th>` và `<td>` có class `sticky-col-1` hoặc `sticky-col-2` chưa?
2. Console có warning về CSS không?

**Debug:**
- Inspect sticky column
- Kiểm tra computed styles:
  - `position: sticky` (có `!important`)
  - `left: 0` hoặc `100px` (có `!important`)
  - `z-index: 5` hoặc `15`

### Vấn đề 3: Box shadow không hiển thị

**Nguyên nhân:** Z-index không đúng

**Giải pháp:**
- Ensure `.sticky-col-1` có `z-index: 5`
- Ensure `thead th.sticky-col-1` có `z-index: 15`

### Vấn đề 4: Scroll lag trên iOS

**Nguyên nhân:** Thiếu `-webkit-overflow-scrolling: touch`

**Giải pháp:**
- Đảm bảo `.table-container` có property này

---

## 📊 TỔNG KẾT

### ✅ Đã fix:
- Scroll ngang hoạt động
- Scroll dọc hoạt động
- Sticky columns cố định đúng
- Header cố định khi scroll
- Smooth scrolling trên iOS

### 🎯 Kết quả:
- Table có width đủ lớn để trigger scroll
- Sticky columns có min-width để không collapse
- !important đảm bảo không bị override
- Position relative giải quyết z-index stacking context
- Webkit overflow scrolling cho smooth UX

---

## 🚀 NEXT STEPS

Sau khi cập nhật và test thành công:

1. **Xác nhận tất cả bảng scroll được:**
   - ✅ Dashboard - Giao dịch gần đây
   - ✅ Tài khoản - Quản lý tài khoản
   - ✅ Tài khoản - Lịch sử chuyển tiền

2. **Test trên thiết bị thật (nếu có):**
   - iPhone/iPad
   - Android phones/tablets

3. **Báo cáo kết quả:**
   - Nếu OK → Phase 2 hoàn thành, sẵn sàng Phase 3
   - Nếu còn vấn đề → Báo chi tiết để debug

---

**HẾT HƯỚNG DẪN FIX SCROLL**

Commit: `7a97a07`
Date: 2025-10-29
