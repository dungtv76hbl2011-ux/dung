# HƯỚNG DẪN CẬP NHẬT - FIX 3 LỖI PHASE 2

## 📋 TỔNG QUAN

Đã fix 3 lỗi nghiêm trọng phát hiện trong quá trình test Phase 2:

### ✅ Lỗi 1: Navigation xóa toàn bộ pages (CRITICAL)
**Hiện tượng:** Chuyển từ Tài khoản → Trang chủ → lại Tài khoản thì tất cả pages hiển thị "Trang đang được phát triển"

**Nguyên nhân:** Function `showPlaceholder()` trong Sidebar.html đang dùng `innerHTML` thay thế toàn bộ nội dung, XÓA TẤT CẢ các pages đã include (page-home, page-accounts).

**Cách fix:** Sửa `showPlaceholder()` để tạo placeholder element mới và `appendChild()` thay vì thay thế innerHTML.

---

### ✅ Lỗi 2: Lịch sử chuyển tiền hiển thị "undefined"
**Hiện tượng:** Cột "Từ tài khoản" và "Đến tài khoản" trong lịch sử chuyển tiền hiển thị "undefined" thay vì tên tài khoản.

**Nguyên nhân:** Code render không có defensive coding, nếu data thiếu field name thì hiển thị undefined.

**Cách fix:** Thêm fallback trong `renderTransferHistory()`:
- Ưu tiên: `fromAccountName` / `toAccountName`
- Fallback: `fromAccountId` / `toAccountId`
- Cuối cùng: "N/A"

---

### ✅ Lỗi 3: Trang chủ hiển thị stats của Accounts khi load
**Hiện tượng:** Khi vào app lần đầu, trang chủ hiển thị cả "Tổng số dư: 0đ" và "Số lượng tài khoản: 0đ" của trang Accounts.

**Nguyên nhân:** Page `page-accounts` không có class `hidden` mặc định, nên hiển thị cùng lúc với `page-home`.

**Cách fix:** Thêm class `hidden` vào `<div id="page-accounts">` trong Accounts.html.

---

## 🔧 HƯỚNG DẪN CẬP NHẬT

### BƯỚC 1: Cập nhật Sidebar.html

Mở file `Sidebar.html` trong Google Apps Script Editor.

**Tìm function `showPlaceholder(page)`** (khoảng dòng 155-190)

**THAY THẾ TOÀN BỘ** function bằng code sau:

```javascript
// Show placeholder for pages not yet implemented
function showPlaceholder(page) {
  const dynamicContent = document.getElementById('dynamicContent');
  if (!dynamicContent) return;

  // Check if placeholder already exists
  let placeholderPage = document.getElementById(`page-${page}`);

  if (!placeholderPage) {
    // Create new placeholder page element (KHÔNG XÓA các page khác)
    placeholderPage = document.createElement('div');
    placeholderPage.id = `page-${page}`;
    placeholderPage.className = 'page-content';

    const pageTitles = {
      'home': 'Trang chủ',
      'income': 'Thu nhập',
      'expense': 'Chi tiêu',
      'budget': 'Ngân sách',
      'loan': 'Khoản vay',
      'investment': 'Đầu tư',
      'third-party': 'Thu chi hộ',
      'accounts': 'Tài khoản',
      'reports': 'Báo cáo',
      'settings': 'Cài đặt'
    };

    placeholderPage.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-info-circle"></i>
            ${pageTitles[page] || page}
          </h3>
        </div>
        <div class="card-body">
          <div style="text-align: center; padding: 60px 20px;">
            <i class="fas fa-tools" style="font-size: 64px; color: var(--gray-color); margin-bottom: 20px;"></i>
            <h3 style="color: var(--dark-color); margin-bottom: 10px;">Trang đang được phát triển</h3>
            <p style="color: var(--gray-color);">Chức năng này sẽ được bổ sung trong Phase tiếp theo.</p>
          </div>
        </div>
      </div>
    `;

    // APPEND (không replace) vào dynamicContent
    dynamicContent.appendChild(placeholderPage);
  }

  // Hide all other pages
  document.querySelectorAll('.page-content').forEach(content => {
    content.classList.add('hidden');
  });

  // Show this placeholder
  placeholderPage.classList.remove('hidden');
}
```

**Điểm khác biệt:**
- ❌ **CŨ:** `contentArea.innerHTML = ...` (XÓA toàn bộ)
- ✅ **MỚI:** `document.createElement()` + `appendChild()` (CHỈ THÊM)

Lưu file (Ctrl + S).

---

### BƯỚC 2: Cập nhật Accounts.html (2 chỗ)

#### 2.1. Fix page visibility

Mở file `Accounts.html` trong Google Apps Script Editor.

**Tìm dòng đầu tiên:**
```html
<div id="page-accounts" class="page-content">
```

**THAY BẰNG:**
```html
<div id="page-accounts" class="page-content hidden">
```

**Lưu ý:** Chỉ thêm từ `hidden` vào class.

---

#### 2.2. Fix transfer history rendering

Trong cùng file `Accounts.html`, **tìm function `renderTransferHistory()`** (khoảng dòng 728-762).

**THAY THẾ TOÀN BỘ** function bằng code sau:

```javascript
// ==================== RENDER TRANSFER HISTORY ====================

function renderTransferHistory() {
  const tbody = document.getElementById('transferHistoryTableBody');
  const emptyState = document.getElementById('transferHistoryEmpty');

  if (TRANSFER_HISTORY.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  tbody.innerHTML = TRANSFER_HISTORY.slice(0, 10).map(transfer => {
    // Log để debug (có thể xóa sau khi fix)
    console.log('[Transfer History] Transfer data:', transfer);

    const date = new Date(transfer.timestamp);
    const dateStr = formatDate(date);

    // Defensive: Lấy account names với fallback
    const fromName = transfer.fromAccountName || transfer.fromAccountId || 'N/A';
    const toName = transfer.toAccountName || transfer.toAccountId || 'N/A';
    const amount = parseFloat(transfer.amount) || 0;
    const desc = transfer.description || '-';

    return `
      <tr>
        <td>${dateStr}</td>
        <td>
          <i class="fas fa-arrow-right text-danger"></i>
          ${fromName}
        </td>
        <td>
          <i class="fas fa-arrow-left text-success"></i>
          ${toName}
        </td>
        <td><strong style="color: var(--primary-color);">${formatCurrency(amount)}</strong></td>
        <td>${desc}</td>
      </tr>
    `;
  }).join('');
}
```

**Điểm khác biệt:**
- Thêm console.log để debug
- Thêm defensive coding với fallback: `fromAccountName || fromAccountId || 'N/A'`
- Parse amount an toàn hơn

Lưu file (Ctrl + S).

---

## 🚀 DEPLOY VÀ TEST

### BƯỚC 3: Deploy lại

1. Click nút **Deploy** → **Test deployments** (hoặc dùng deployment hiện có)
2. Copy URL và mở trong trình duyệt **MỚI** (hoặc hard refresh: Ctrl + Shift + R)

---

### BƯỚC 4: Test các lỗi đã fix

#### TEST 1: Trang chủ load đúng

**Thực hiện:**
1. Đăng nhập vào app
2. Quan sát trang chủ

**Kết quả mong đợi:**
- ✅ Chỉ hiển thị 4 stats cards: Thu nhập, Chi tiêu, Tiết kiệm, Tổng tài sản
- ✅ **KHÔNG** hiển thị "Tổng số dư" hoặc "Số lượng tài khoản" của trang Accounts
- ✅ **KHÔNG** hiển thị section "Quản lý Tài khoản"
- ✅ Hiển thị "Giao dịch gần đây" nếu có data

---

#### TEST 2: Navigation hoạt động đúng

**Thực hiện:**
1. Từ Trang chủ, click menu **Tài khoản**
2. Quan sát trang Tài khoản load đúng
3. Click menu **Trang chủ**
4. Quan sát trang chủ hiển thị lại
5. Click lại menu **Tài khoản**

**Kết quả mong đợi:**
- ✅ Lần 1: Trang Tài khoản hiển thị đúng (stats + bảng)
- ✅ Lần 2: Trang chủ hiển thị lại đúng (dashboard)
- ✅ Lần 3: Trang Tài khoản **VẪN HIỂN thị ĐÚNG** (KHÔNG bị placeholder "Trang đang được phát triển")

**Nếu thất bại:** Có nghĩa là vẫn còn lỗi navigation, kiểm tra lại code Sidebar.html.

---

#### TEST 3: Lịch sử chuyển tiền hiển thị đúng

**Thực hiện:**
1. Vào trang **Tài khoản**
2. Thực hiện chuyển tiền (ví dụ: Tiền mặt → ACB, 100.000đ)
3. Scroll xuống phần **Lịch sử chuyển tiền**
4. Mở Console (F12 → Tab Console) để xem log

**Kết quả mong đợi:**
- ✅ Bảng lịch sử hiển thị giao dịch vừa thực hiện
- ✅ Cột "Từ tài khoản" hiển thị tên tài khoản (ví dụ: "Tiền mặt") - **KHÔNG phải "undefined"**
- ✅ Cột "Đến tài khoản" hiển thị tên tài khoản (ví dụ: "ACB") - **KHÔNG phải "undefined"**
- ✅ Cột "Số tiền" hiển thị đúng: 100.000₫
- ✅ Console log hiển thị transfer object với đầy đủ fields

**Kiểm tra console log:**
```javascript
[Transfer History] Transfer data: {
  logId: "LOG_xxx",
  timestamp: "29/10/2025 10:30",
  userId: "USR001",
  transferId: "TRF001",
  fromAccountId: "ACC001",
  fromAccountName: "Tiền mặt",     // ← PHẢI CÓ FIELD NÀY
  toAccountId: "ACC002",
  toAccountName: "ACB",             // ← PHẢI CÓ FIELD NÀY
  amount: 100000,
  description: "...",
  userName: "Admin"
}
```

**Nếu fromAccountName/toAccountName là `undefined` trong console log:**
- Có nghĩa là backend không trả về đúng data
- Kiểm tra lại `handleGetTransferHistory()` trong AccountTransfer.gs
- Đảm bảo sheet AUDIT_LOG có logDetails chứa fromAccountName/toAccountName

---

#### TEST 4: Navigation các trang chưa phát triển

**Thực hiện:**
1. Click menu **Thu nhập** (chưa phát triển)
2. Quan sát placeholder hiển thị
3. Click menu **Tài khoản**
4. Quan sát trang Tài khoản hiển thị lại đúng

**Kết quả mong đợi:**
- ✅ Placeholder "Trang đang được phát triển" hiển thị cho Thu nhập
- ✅ Quay lại Tài khoản, trang **VẪN HOẠT ĐỘNG BÌNH THƯỜNG**

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: Vẫn thấy "undefined" trong transfer history

**Kiểm tra:**
1. Mở Console (F12)
2. Xem log `[Transfer History] Transfer data:`
3. Nếu object không có `fromAccountName` / `toAccountName`:

**Nguyên nhân:** Backend không trả về đúng.

**Giải pháp:**
- Kiểm tra `handleGetTransferHistory()` trong AccountTransfer.gs (dòng 156-168)
- Đảm bảo code có:
  ```javascript
  transfers.push({
    ...
    fromAccountName: logDetails.fromAccountName,
    toAccountName: logDetails.toAccountName,
    ...
  });
  ```
- Kiểm tra sheet AUDIT_LOG, cột `logDetails` có chứa JSON với `fromAccountName` không

**Nếu data cũ không có fromAccountName:**
- Thực hiện transfer mới
- Transfer mới sẽ có đầy đủ thông tin

---

### Lỗi 2: Vẫn thấy placeholder sau khi navigate

**Kiểm tra:**
1. Console có lỗi JavaScript không?
2. File Sidebar.html đã save chưa?
3. Deploy lại chưa?
4. Hard refresh trình duyệt (Ctrl + Shift + R)?

**Giải pháp:**
- Đảm bảo đã THAY THẾ đúng function `showPlaceholder()`
- Kiểm tra code có dòng `dynamicContent.appendChild(placeholderPage);` không
- **KHÔNG được có** dòng `contentArea.innerHTML = ...`

---

### Lỗi 3: Trang chủ vẫn hiển thị stats Accounts

**Kiểm tra:**
1. File Accounts.html dòng 6 có `class="page-content hidden"` chưa?
2. Deploy lại chưa?
3. Hard refresh (Ctrl + Shift + R)?

**Giải pháp:**
- Đảm bảo dòng 6 trong Accounts.html là:
  ```html
  <div id="page-accounts" class="page-content hidden">
  ```
- Từ `hidden` phải có trong class attribute

---

## 📊 TỔNG KẾT

### Files đã sửa:
1. **Sidebar.html** - Function `showPlaceholder()`
2. **Accounts.html** - 2 chỗ:
   - Thêm `hidden` vào dòng 6
   - Function `renderTransferHistory()`

### Kết quả sau khi fix:
- ✅ Navigation hoạt động mượt mà, không bị mất pages
- ✅ Lịch sử chuyển tiền hiển thị đúng tên tài khoản
- ✅ Trang chủ chỉ hiển thị dashboard, không có stats accounts
- ✅ App hoạt động ổn định, sẵn sàng cho Phase 3

---

## 🚀 NEXT STEPS

Sau khi test tất cả OK, hãy:

1. **Đóng Console log** (nếu không cần debug nữa)
   - Có thể xóa dòng `console.log('[Transfer History] Transfer data:', transfer);` trong Accounts.html nếu muốn

2. **Test các tính năng khác của Phase 2:**
   - Thêm/Sửa/Xóa tài khoản
   - Chuyển tiền với các trường hợp edge (số dư không đủ, cùng tài khoản, v.v.)
   - Responsive mobile

3. **Báo cáo kết quả:**
   - Nếu tất cả OK → Sẵn sàng chuyển sang Phase 3
   - Nếu còn lỗi → Báo chi tiết để fix tiếp

---

**HẾT HƯỚNG DẪN CẬP NHẬT**

Commit: `ffdc7d8`
Date: 2025-10-29
