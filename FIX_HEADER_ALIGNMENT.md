# FIX LỖI HEADER VÀ DATA COLUMNS KHÔNG KHỚP

## 🐛 VẤN ĐỀ

Headers và data columns **KHÔNG KHỚP** khi scroll ngang, ngay cả khi đã tắt `position: sticky`.

Lỗi xuất hiện trên **CẢ DESKTOP VÀ MOBILE**.

---

## 🔍 NGUYÊN NHÂN SÂU XA

Vấn đề không chỉ là `position: sticky`, mà còn do **table layout algorithm**:

### **1. Table-layout: auto (default):**
- `thead` và `tbody` tính column widths **RIÊNG BIỆT**
- thead dựa vào header content
- tbody dựa vào data content
- **→ Widths khác nhau → Misalignment**

### **2. Border-collapse: collapse:**
- Borders được tính toán phức tạp
- Có thể gây sub-pixel rendering differences
- Làm tăng khả năng misalignment

### **3. White-space: nowrap + auto layout:**
- Content không wrap → widths không dự đoán được
- Browser tự động adjust widths
- **→ thead và tbody có thể adjust khác nhau**

---

## 🔧 GIẢI PHÁP

Dùng `table-layout: fixed` để **BUỘC** thead và tbody dùng **CÙNG** layout algorithm.

---

## 📝 HƯỚNG DẪN CẬP NHẬT

### **BƯỚC 1: Cập nhật table CSS**

Mở file `Styles.html`, tìm dòng **407-414** (phần table CSS).

**TÌM:**
```css
table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: 14px;
}
```

**THAY BẰNG:**
```css
table {
  width: 100%;
  min-width: 800px;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}
```

**Thay đổi:**
- ➕ Thêm `table-layout: fixed`
- 🔄 Đổi `border-collapse: collapse` → `border-collapse: separate`
- ➕ Thêm `border-spacing: 0`

---

### **BƯỚC 2: Cập nhật thead th CSS**

Tìm dòng **423-431** (phần thead th CSS).

**TÌM:**
```css
thead th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: var(--white-color);
  background-color: var(--dark-color);
  white-space: nowrap;
}
```

**THAY BẰNG:**
```css
thead th {
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: var(--white-color);
  background-color: var(--dark-color);
  white-space: nowrap;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

thead th:last-child {
  border-right: none;
}
```

**Thay đổi:**
- ➕ Thêm `border-right` cho mỗi header cell
- ➕ Thêm rule `:last-child` để xóa border cuối cùng

---

### **BƯỚC 3: Cập nhật tbody td CSS**

Tìm dòng **446-450** (phần tbody td CSS).

**TÌM:**
```css
tbody td {
  padding: 12px 15px;
  white-space: nowrap;
}
```

**THAY BẰNG:**
```css
tbody td {
  padding: 12px 15px;
  white-space: nowrap;
  border-right: 1px solid var(--light-color);
}

tbody td:last-child {
  border-right: none;
}
```

**Thay đổi:**
- ➕ Thêm `border-right` cho mỗi data cell
- ➕ Thêm rule `:last-child` để xóa border cuối cùng

---

### **BƯỚC 4: Lưu và Deploy**

1. **Lưu** file Styles.html (Ctrl + S)
2. **Deploy** lại webapp
3. **CLEAR CACHE** và **HARD REFRESH:**
   - Chrome: Ctrl + Shift + Delete → Clear cache → Ctrl + Shift + R
   - Hoặc: Mở Incognito/Private window
4. Test trên cả desktop và mobile

---

## ✅ KẾT QUẢ MONG ĐỢI

### **Sau khi fix:**

**Desktop:**
- ✅ Headers khớp hoàn toàn với data columns
- ✅ Scroll ngang mượt mà, không bị shift
- ✅ Borders rõ ràng giữa các columns

**Mobile:**
- ✅ Headers khớp khi scroll ngang
- ✅ Không bị misalignment
- ✅ UX mượt mà

---

## 🎨 VISUAL CHANGES

### **Trước:**
```
Headers:   | Ngày   | Loại     | Danh mục | Số tiền |
                    ↑ KHÔNG KHỚP
Data:      | 16/10  | Thu nhập | Lương    | 10tr    |
```

### **Sau:**
```
Headers:   | Ngày   | Loại     | Danh mục | Số tiền |
           ↓ KHỚP   ↓ KHỚP     ↓ KHỚP     ↓ KHỚP
Data:      | 16/10  | Thu nhập | Lương    | 10tr    |
```

Plus: Có borders dọc giữa các columns (subtle, không quá nổi bật).

---

## 🔬 CÁCH KIỂM TRA

### **Test 1: Desktop**

1. Mở ứng dụng trên desktop
2. Vào Trang chủ → Scroll xuống "Giao dịch gần đây"
3. Nhìn vào header và row đầu tiên
4. **Kiểm tra:** Headers có khớp với data không?

**Kết quả mong đợi:**
- ✅ Mỗi header nằm chính xác trên cột data tương ứng
- ✅ Borders dọc giữa các columns thẳng hàng

---

### **Test 2: Mobile - Scroll ngang**

1. Mở DevTools (F12) → Toggle device toolbar (Ctrl + Shift + M)
2. Chọn iPhone 12 Pro
3. Vào Trang chủ hoặc Tài khoản
4. **Scroll ngang** từ trái sang phải
5. **Quan sát:** Headers có bị shift không?

**Kết quả mong đợi:**
- ✅ Headers luôn khớp với data khi scroll
- ✅ Không có jump hoặc misalignment
- ✅ Borders di chuyển mượt mà cùng với scroll

---

### **Test 3: Multiple tables**

Test trên **TẤT CẢ** các bảng:
- ✅ Dashboard → Giao dịch gần đây
- ✅ Tài khoản → Quản lý tài khoản
- ✅ Tài khoản → Lịch sử chuyển tiền

**Tất cả phải alignment đúng.**

---

## 🐛 TROUBLESHOOTING

### **Vấn đề 1: Vẫn không khớp**

**Kiểm tra:**
1. Cache đã clear chưa? → Hard refresh (Ctrl + Shift + R)
2. Deploy đã hoàn tất chưa? → Đợi vài giây rồi refresh lại
3. CSS đã apply chưa?
   - F12 → Elements → Click vào `<table>`
   - Tab **Computed** → Tìm `table-layout`
   - **Phải là:** `table-layout: fixed`

**Nếu vẫn là `auto`:**
- CSS chưa được apply
- Kiểm tra file Styles.html có lỗi syntax không
- Deploy lại

---

### **Vấn đề 2: Columns quá hẹp hoặc quá rộng**

**Nguyên nhân:** `table-layout: fixed` chia columns đều nhau

**Giải pháp (nếu cần):**
Có thể set width cụ thể cho từng column:

```css
/* Thêm vào Styles.html */
thead th:nth-child(1) { width: 15%; }  /* Ngày */
thead th:nth-child(2) { width: 20%; }  /* Loại */
thead th:nth-child(3) { width: 25%; }  /* Danh mục */
thead th:nth-child(4) { width: 20%; }  /* Số tiền */
thead th:nth-child(5) { width: 20%; }  /* Mô tả */
```

**Lưu ý:** Chỉ cần set trên `thead th`, tbody td sẽ tự follow.

---

### **Vấn đề 3: Borders quá nổi bật**

**Giải pháp:** Điều chỉnh opacity

```css
/* Trong Styles.html, line 430 */
border-right: 1px solid rgba(255, 255, 255, 0.05);  /* Nhạt hơn */

/* Line 449 */
border-right: 1px solid rgba(0, 0, 0, 0.05);  /* Nhạt hơn */
```

---

## 📊 TECHNICAL EXPLANATION

### **Table-layout: fixed vs auto:**

**Auto (default):**
```
┌─────────────────────────────┐
│ Browser tính width dựa vào │
│ content của TỪNG cell       │
└─────────────────────────────┘
         ↓
┌────────────┬─────────────┐
│ thead      │ tính riêng  │
├────────────┼─────────────┤
│ tbody      │ tính riêng  │
└────────────┴─────────────┘
         ↓
    Có thể khác nhau!
```

**Fixed:**
```
┌─────────────────────────────┐
│ Browser chia đều columns    │
│ dựa vào table width         │
└─────────────────────────────┘
         ↓
┌────────────┬─────────────┐
│ thead      │ cùng width  │
├────────────┼─────────────┤
│ tbody      │ cùng width  │
└────────────┴─────────────┘
         ↓
    LUÔN KHỚP!
```

### **Border-collapse: separate vs collapse:**

**Collapse:**
- Borders giữa cells được merge
- Phức tạp khi tính toán
- Có thể gây sub-pixel issues

**Separate:**
- Mỗi cell có border riêng
- Đơn giản, dự đoán được
- Dùng `border-spacing: 0` để không có gap

---

## 🎯 TÓM TẮT

**3 thay đổi chính:**

1. **table-layout: fixed**
   - Headers và data dùng cùng layout
   - **→ KHỚP hoàn toàn**

2. **border-collapse: separate + border-spacing: 0**
   - Rendering đơn giản hơn
   - **→ Không có sub-pixel issues**

3. **Explicit borders**
   - Borders rõ ràng giữa columns
   - **→ Visual feedback tốt hơn**

---

## 🚀 SAU KHI FIX XONG

Nếu alignment đã OK, chúng ta có thể:

1. **Thêm sticky columns** (cột đầu cố định khi scroll ngang)
2. **Thử thêm lại sticky header** (nếu cần)
3. **Fine-tune column widths** (nếu cần)

Hãy báo kết quả sau khi test để tôi biết bước tiếp theo nhé! ✅

---

**Commit:** `ff8bc39`
**Date:** 2025-10-29
**Status:** Fixed table-layout for perfect alignment
