# HƯỚNG DẪN TÍCH HỢP PHASE 2 - QUẢN LÝ TÀI KHOẢN & CHUYỂN TIỀN

## 📋 TỔNG QUAN

Phase 2 bổ sung các tính năng:
- ✅ CRUD tài khoản (Tiền mặt, Ngân hàng, Ví điện tử)
- ✅ Chuyển tiền giữa các tài khoản
- ✅ Kiểm tra số dư trước giao dịch
- ✅ Tự động cập nhật số dư
- ✅ Lịch sử chuyển tiền
- ✅ Thống kê theo tài khoản

---

## 📁 DANH SÁCH FILES CẦN TẠO/CẬP NHẬT

### Files Backend (.gs) - Tạo mới:
1. **Account.gs** (374 dòng)
2. **AccountTransfer.gs** (255 dòng)

### Files Frontend (.html) - Tạo mới:
3. **Accounts.html** (765 dòng)

### Files cần chỉnh sửa:
4. **Index.html** - Thêm include Accounts page
5. **Sidebar.html** - Thêm auto-initialization

---

## 🔧 HƯỚNG DẪN TÍCH HỢP

### BƯỚC 1: Tạo Backend Files

#### 1.1. Tạo file Account.gs
1. Vào Google Apps Script Editor
2. Click (+) bên cạnh "Files" → "Script"
3. Đặt tên: `Account.gs`
4. Copy toàn bộ nội dung từ file `Account.gs` trong repo
5. Lưu (Ctrl + S)

**Chức năng chính:**
- `handleGetAllAccounts()` - Lấy danh sách tài khoản + tổng số dư
- `handleGetAccountById(accountId)` - Lấy chi tiết 1 tài khoản
- `handleCreateAccount(accountData)` - Tạo tài khoản mới
- `handleUpdateAccount(accountId, accountData)` - Cập nhật thông tin
- `handleDeleteAccount(accountId)` - Xóa tài khoản (nếu không có giao dịch)
- `updateAccountBalance(accountId, amount, isIncrease)` - Cập nhật số dư
- `validateAccountBalance(accountId, amount)` - Kiểm tra số dư đủ không
- `checkAccountHasTransactions(accountId)` - Kiểm tra có giao dịch liên quan

#### 1.2. Tạo file AccountTransfer.gs
1. Click (+) → "Script"
2. Đặt tên: `AccountTransfer.gs`
3. Copy toàn bộ nội dung từ file `AccountTransfer.gs` trong repo
4. Lưu (Ctrl + S)

**Chức năng chính:**
- `handleTransferMoney(transferData)` - Chuyển tiền giữa tài khoản (atomic transaction)
- `handleGetTransferHistory(filters)` - Lấy lịch sử chuyển tiền
- `handleGetTransferStats(accountId, month)` - Thống kê chuyển tiền theo tài khoản

**Đặc điểm quan trọng:**
- ✅ Atomic transaction (cả 2 tài khoản cập nhật hoặc không)
- ✅ Kiểm tra số dư trước khi chuyển
- ✅ Log đầy đủ trong AUDIT_LOG
- ✅ Lưu số dư trước/sau của cả 2 tài khoản

---

### BƯỚC 2: Tạo Frontend File

#### 2.1. Tạo file Accounts.html
1. Click (+) → "HTML"
2. Đặt tên: `Accounts.html`
3. Copy toàn bộ nội dung từ file `Accounts.html` trong repo
4. Lưu (Ctrl + S)

**Cấu trúc UI:**
```
├── Stats Cards
│   ├── Tổng số dư (Gradient cam)
│   └── Số lượng tài khoản (Gradient xanh)
├── Accounts Table (Sticky header)
│   ├── Cột: Loại, Tên, Số dư, Thao tác
│   └── Buttons: Thêm, Sửa, Xóa, Chuyển tiền
├── Add/Edit Account Modal
│   ├── Loại tài khoản (dropdown)
│   ├── Tên tài khoản
│   ├── Số dư đầu kỳ (với format 1.000.000)
│   ├── Số tài khoản (optional)
│   ├── Mã ngân hàng (optional)
│   └── Chi nhánh (optional)
├── Transfer Money Modal
│   ├── Từ tài khoản (dropdown)
│   ├── Đến tài khoản (dropdown)
│   ├── Số tiền (với format)
│   ├── Hiển thị số dư hiện tại
│   └── Mô tả (optional)
└── Transfer History Table
    └── Hiển thị lịch sử chuyển tiền
```

**Các function chính:**
- `initAccountsPage()` - Khởi tạo trang, load data
- `loadAccountsData()` - Load danh sách tài khoản từ cache
- `showAddAccountModal()` - Hiện modal thêm tài khoản
- `handleAddAccount(event)` - Xử lý tạo tài khoản mới
- `showEditAccountModal(accountId)` - Hiện modal sửa
- `handleEditAccount(event)` - Xử lý cập nhật
- `confirmDeleteAccount(accountId)` - Xác nhận xóa
- `showTransferModal()` - Hiện modal chuyển tiền
- `handleTransferMoney(event)` - Xử lý chuyển tiền
- `updateTransferBalance()` - Cập nhật số dư khi chọn tài khoản nguồn

---

### BƯỚC 3: Chỉnh sửa Index.html

Mở file `Index.html` và tìm dòng:
```html
<!-- Các page khác sẽ được thêm ở đây -->
```

Ngay **sau dòng đó**, thêm:
```html
<!-- Trang Quản lý Tài khoản -->
<?!= include('Accounts'); ?>
```

**Kết quả sau khi sửa:**
```html
<!-- Các page khác sẽ được thêm ở đây -->

<!-- Trang Quản lý Tài khoản -->
<?!= include('Accounts'); ?>
</div>
```

Lưu file (Ctrl + S)

---

### BƯỚC 4: Chỉnh sửa Sidebar.html

Mở file `Sidebar.html` và tìm function `showPage(page)` (khoảng dòng 130).

Tìm đoạn code:
```javascript
// Call page init function if exists
setTimeout(function() {
  if (page === 'accounts' && typeof initAccountsPage !== 'undefined') {
    initAccountsPage();
  }
  // Add more page init functions here as needed
}, 100);
```

**NẾU CHƯA CÓ**, thay thế toàn bộ function `showPage` bằng:
```javascript
// Show page content
function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(content => {
    content.classList.add('hidden');
  });

  // Show selected page
  const pageContent = document.getElementById(`page-${page}`);
  if (pageContent) {
    pageContent.classList.remove('hidden');

    // Call page init function if exists
    setTimeout(function() {
      if (page === 'accounts' && typeof initAccountsPage !== 'undefined') {
        initAccountsPage();
      }
      // Add more page init functions here as needed
    }, 100);

  } else {
    // If page doesn't exist yet, show placeholder
    showPlaceholder(page);
  }
}
```

Lưu file (Ctrl + S)

---

## 🚀 DEPLOY & TEST

### BƯỚC 5: Deploy ứng dụng

1. Click nút **Deploy** → **Test deployments**
2. Hoặc dùng deployment hiện có
3. Copy URL và mở trong trình duyệt

### BƯỚC 6: Kiểm tra sheet Tài khoản

Vào Google Sheets, kiểm tra sheet `Tài khoản` có cấu trúc:

| AccountID | Loại | Tên tài khoản | Số dư đầu kỳ | Số dư hiện tại | Metadata |
|-----------|------|---------------|--------------|----------------|----------|
| ACC001    | Cash | Tiền mặt      | 5000000      | 5000000        | {...}    |
| ACC002    | Bank | VCB           | 20000000     | 20000000       | {...}    |
| ACC003    | E-wallet | Momo      | 1000000      | 1000000        | {...}    |

Nếu chưa có, file `InitSetup.gs` đã tạo sẵn 3 tài khoản mẫu.

---

## ✅ TEST CASES

### TEST 1: Xem danh sách tài khoản

**Bước thực hiện:**
1. Đăng nhập với `admin/[password-mới]` hoặc `user1/user123`
2. Click menu **Tài khoản** ở sidebar
3. Chờ trang load

**Kết quả mong đợi:**
- ✅ Thẻ "Tổng số dư" hiển thị tổng số dư của tất cả tài khoản (màu cam gradient)
- ✅ Thẻ "Số lượng tài khoản" hiển thị số lượng (màu xanh gradient)
- ✅ Bảng hiển thị danh sách tài khoản với các cột: Loại, Tên, Số dư, Thao tác
- ✅ Mỗi tài khoản có 3 nút: Sửa (xanh), Xóa (đỏ), Chuyển tiền (cam)
- ✅ Số dư hiển thị định dạng 1.000.000₫

---

### TEST 2: Thêm tài khoản mới

**Bước thực hiện:**
1. Click nút **Thêm tài khoản** (màu xanh, ở góc phải)
2. Modal hiện ra
3. Nhập thông tin:
   - Loại: **Bank**
   - Tên: **Techcombank**
   - Số dư đầu kỳ: **10000000** (sẽ tự format thành 10.000.000)
   - Số tài khoản: **19036631234567**
   - Mã ngân hàng: **TCB**
   - Chi nhánh: **TP.HCM**
4. Click **Lưu**

**Kết quả mong đợi:**
- ✅ Hiện loading spinner trên nút Lưu
- ✅ Sau ~1-2 giây, modal đóng
- ✅ Hiện toast thông báo "Tạo tài khoản thành công"
- ✅ Bảng tự động cập nhật, hiển thị tài khoản mới (ACC004)
- ✅ Thẻ "Tổng số dư" tăng thêm 10.000.000₫
- ✅ Thẻ "Số lượng tài khoản" tăng lên 4

**Kiểm tra trong Sheet:**
- Mở sheet `Tài khoản`, thấy dòng mới:
  ```
  ACC004 | Bank | Techcombank | 10000000 | 10000000 | {"accountNumber":"19036631234567",...}
  ```

---

### TEST 3: Sửa thông tin tài khoản

**Bước thực hiện:**
1. Click nút **Sửa** (icon bút) ở tài khoản Techcombank vừa tạo
2. Modal hiện ra với thông tin đã điền sẵn
3. Đổi tên thành: **Techcombank - Tài khoản chính**
4. Đổi chi nhánh thành: **Quận 1, TP.HCM**
5. Click **Cập nhật**

**Kết quả mong đợi:**
- ✅ Modal đóng
- ✅ Hiện toast "Cập nhật tài khoản thành công"
- ✅ Bảng cập nhật tên tài khoản mới
- ✅ **Số dư không đổi** (vẫn 10.000.000₫)

**Lưu ý:**
- ⚠️ Không thể sửa số dư qua modal Edit (số dư chỉ thay đổi qua giao dịch/chuyển tiền)

---

### TEST 4: Xóa tài khoản (thành công)

**Bước thực hiện:**
1. Tạo thêm 1 tài khoản test: **Cash** - **Test Delete** - Số dư: **0**
2. Click nút **Xóa** (icon thùng rác màu đỏ) ở tài khoản vừa tạo
3. Modal xác nhận hiện ra: "Bạn có chắc chắn muốn xóa tài khoản này?"
4. Click **Xóa**

**Kết quả mong đợi:**
- ✅ Modal đóng
- ✅ Hiện toast "Xóa tài khoản thành công"
- ✅ Tài khoản biến mất khỏi bảng
- ✅ Thẻ "Số lượng tài khoản" giảm đi 1

---

### TEST 5: Xóa tài khoản (thất bại - có giao dịch)

**Bước thực hiện:**
1. Click nút **Xóa** ở tài khoản **Tiền mặt** (ACC001) - tài khoản đã có giao dịch trong Phase 1
2. Modal xác nhận hiện ra
3. Click **Xóa**

**Kết quả mong đợi:**
- ✅ Hiện modal LỖI màu đỏ với thông báo:
  ```
  Không thể xóa tài khoản đã có giao dịch.
  Vui lòng chuyển số dư về 0 và không còn giao dịch liên quan.
  ```
- ✅ Tài khoản **không bị xóa**

**Logic bảo vệ:**
- Hệ thống kiểm tra trong sheet `Thu nhập` và `Chi tiêu`
- Nếu có giao dịch nào sử dụng AccountID này → Không cho xóa

---

### TEST 6: Chuyển tiền giữa tài khoản

**Bước thực hiện:**
1. Click nút **Chuyển tiền** ở tài khoản **Tiền mặt** (hoặc nút "Chuyển tiền" ở góc phải)
2. Modal chuyển tiền hiện ra
3. Chọn:
   - **Từ tài khoản**: Tiền mặt (số dư hiện tại: 5.000.000₫)
   - **Đến tài khoản**: Techcombank
   - **Số tiền**: 2000000 (tự format thành 2.000.000)
   - **Mô tả**: Chuyển tiền đầu tư
4. Click **Chuyển tiền**

**Kết quả mong đợi:**
- ✅ Hiện loading spinner
- ✅ Sau ~1-2 giây, modal đóng
- ✅ Hiện toast "Chuyển tiền thành công"
- ✅ Bảng tài khoản tự động cập nhật:
  - Tiền mặt: 5.000.000 → **3.000.000₫**
  - Techcombank: 10.000.000 → **12.000.000₫**
- ✅ Thẻ "Tổng số dư" **không đổi** (chỉ chuyển nội bộ)

**Kiểm tra trong Sheet:**
- Mở sheet `Tài khoản`:
  ```
  ACC001 | Cash | Tiền mặt | 5000000 | 3000000 | {...}
  ACC004 | Bank | Techcombank | 10000000 | 12000000 | {...}
  ```

- Mở sheet `AUDIT_LOG`, thấy log mới:
  ```
  logId: LOG_xxx
  timestamp: 2025-10-29 ...
  userId: USR001
  action: transfer
  targetType: account
  targetId: ACC001
  logDetails: {"transferId":"TRF001","fromAccountId":"ACC001",...}
  ```

---

### TEST 7: Chuyển tiền - Số dư không đủ

**Bước thực hiện:**
1. Mở modal chuyển tiền
2. Chọn:
   - **Từ tài khoản**: Tiền mặt (số dư: 3.000.000₫)
   - **Đến tài khoản**: Techcombank
   - **Số tiền**: 5000000 (lớn hơn số dư)
3. Click **Chuyển tiền**

**Kết quả mong đợi:**
- ✅ Hiện thông báo LỖI màu đỏ:
  ```
  Số dư tài khoản nguồn không đủ.
  Số dư hiện tại: 3.000.000₫
  Cần: 5.000.000₫
  ```
- ✅ Không có tài khoản nào bị thay đổi số dư

---

### TEST 8: Chuyển tiền - Cùng tài khoản

**Bước thực hiện:**
1. Mở modal chuyển tiền
2. Chọn:
   - **Từ tài khoản**: Tiền mặt
   - **Đến tài khoản**: Tiền mặt (cùng tài khoản)
   - **Số tiền**: 1000000
3. Click **Chuyển tiền**

**Kết quả mong đợi:**
- ✅ Hiện thông báo LỖI:
  ```
  Không thể chuyển tiền cho cùng một tài khoản
  ```

---

### TEST 9: Xem lịch sử chuyển tiền

**Bước thực hiện:**
1. Scroll xuống phần **Lịch sử chuyển tiền** (dưới bảng tài khoản)
2. Xem bảng lịch sử

**Kết quả mong đợi:**
- ✅ Bảng hiển thị các cột: Thời gian, Từ TK, Đến TK, Số tiền, Mô tả
- ✅ Giao dịch chuyển tiền vừa thực hiện ở TEST 6 xuất hiện
- ✅ Số tiền hiển thị định dạng đúng: 2.000.000₫
- ✅ Thời gian đúng (16/10/2025 hoặc ngày test)

---

### TEST 10: Format số tiền tự động

**Bước thực hiện:**
1. Mở modal thêm tài khoản
2. Nhập số dư: **1234567** (không có dấu chấm)
3. Click ra ngoài ô input (blur)

**Kết quả mong đợi:**
- ✅ Số tự động format thành: **1.234.567**

**Thử ngược lại:**
1. Xóa và nhập: **5.000.000**
2. Click Lưu

**Kết quả mong đợi:**
- ✅ Hệ thống parse đúng thành số 5000000
- ✅ Lưu thành công

---

### TEST 11: Responsive Mobile

**Bước thực hiện:**
1. Mở DevTools (F12)
2. Chuyển sang chế độ Mobile (Ctrl + Shift + M)
3. Chọn iPhone hoặc Android
4. Kiểm tra giao diện

**Kết quả mong đợi:**
- ✅ Bảng tài khoản scroll ngang được (horizontal scroll)
- ✅ Stats cards xếp dọc (1 cột)
- ✅ Buttons Thêm/Chuyển tiền vẫn hiển thị đúng
- ✅ Modal chiếm 90% width màn hình
- ✅ Sidebar có thể toggle on/off

---

### TEST 12: Cache & Performance

**Bước thực hiện:**
1. Mở DevTools → Tab Console
2. Chuyển tới trang Tài khoản
3. Quan sát log: `[Accounts Page] Loaded X accounts`
4. Click menu Trang chủ
5. Click lại menu Tài khoản
6. Quan sát log

**Kết quả mong đợi:**
- ✅ Lần đầu: Data load từ server (có thể thấy log)
- ✅ Lần sau: Data load từ `APP_DATA.accounts` (instant, không call server)
- ✅ Trang hiển thị nhanh chóng

---

## 🐛 XỬ LÝ LỖI & TROUBLESHOOTING

### Lỗi 1: Không thấy menu "Tài khoản" trong Sidebar

**Nguyên nhân:** File Sidebar.html chưa được deploy hoặc chưa refresh cache.

**Giải pháp:**
1. Đảm bảo đã deploy lại sau khi sửa Sidebar.html
2. Hard refresh trình duyệt (Ctrl + Shift + R)
3. Hoặc xóa cache và reload

---

### Lỗi 2: Click menu "Tài khoản" nhưng không thấy gì

**Nguyên nhân:** File Index.html chưa include Accounts.html.

**Giải pháp:**
1. Kiểm tra Index.html có dòng `<?!= include('Accounts'); ?>`
2. Đảm bảo file Accounts.html đã được tạo trong Apps Script Editor
3. Deploy lại

---

### Lỗi 3: Thẻ thống kê hiển thị "NaN₫"

**Nguyên nhân:** Dữ liệu trong sheet `Tài khoản` có giá trị không phải số.

**Giải pháp:**
1. Mở sheet `Tài khoản`
2. Kiểm tra cột `Số dư hiện tại`
3. Đảm bảo tất cả giá trị là số (không có text)
4. Format cột thành Number

---

### Lỗi 4: Không thể chuyển tiền - Lỗi "Không tìm thấy tài khoản"

**Nguyên nhân:** AccountID không khớp hoặc cache chưa cập nhật.

**Giải pháp:**
1. Hard refresh trang (Ctrl + Shift + R)
2. Kiểm tra trong sheet `Tài khoản` AccountID có đúng không
3. Thử đăng xuất và đăng nhập lại

---

### Lỗi 5: Số dư không cập nhật sau chuyển tiền

**Nguyên nhân:** Lỗi trong function `updateAccountBalance()` hoặc cache không refresh.

**Giải pháp:**
1. Kiểm tra Console có lỗi không (F12 → Console tab)
2. Reload trang để load lại data từ server
3. Kiểm tra trong sheet `Tài khoản` số dư đã cập nhật chưa
4. Nếu sheet đúng mà UI sai → Cache issue, hard refresh

---

### Lỗi 6: Modal không đóng sau khi Lưu

**Nguyên nhân:** Lỗi server không return response hoặc JavaScript error.

**Giải pháp:**
1. Mở Console (F12) xem lỗi
2. Kiểm tra Network tab → XHR → Xem response từ server
3. Nếu có lỗi "Chưa đăng nhập" → Session hết hạn, đăng nhập lại
4. Nếu có lỗi khác → Report lỗi với message cụ thể

---

### Lỗi 7: Lịch sử chuyển tiền không hiển thị

**Nguyên nhân:** Chưa có giao dịch chuyển tiền nào hoặc filter sai.

**Giải pháp:**
1. Kiểm tra đã thực hiện chuyển tiền thành công chưa
2. Mở sheet `AUDIT_LOG` → Tìm row có `action = transfer`
3. Kiểm tra `logDetails` có dữ liệu đúng không
4. Nếu có trong sheet mà không hiện → Lỗi parse JSON, kiểm tra format

---

## 📊 KIỂM TRA DỮ LIỆU TRONG SHEETS

### Sheet: Tài khoản

**Cấu trúc:**
```
| A          | B    | C                  | D             | E              | F                                    |
|------------|------|--------------------|---------------|----------------|--------------------------------------|
| AccountID  | Loại | Tên tài khoản      | Số dư đầu kỳ  | Số dư hiện tại | Metadata                             |
| ACC001     | Cash | Tiền mặt           | 5000000       | 3000000        | {"accountNumber":"","bankCode":""...}|
| ACC002     | Bank | VCB                | 20000000      | 20000000       | {...}                                |
| ACC003     | E-wallet | Momo           | 1000000       | 1000000        | {...}                                |
| ACC004     | Bank | Techcombank        | 10000000      | 12000000       | {...}                                |
```

**Kiểm tra:**
- ✅ Cột E (Số dư hiện tại) thay đổi sau chuyển tiền
- ✅ Metadata là JSON hợp lệ

---

### Sheet: AUDIT_LOG

**Tìm transfer log:**
```
| logId    | Thời gian        | userId | action   | targetType | targetId | logDetails                           |
|----------|------------------|--------|----------|------------|----------|--------------------------------------|
| LOG_xxx  | 29/10/2025 10:30 | USR001 | transfer | account    | ACC001   | {"transferId":"TRF001","fromAcc...} |
```

**Kiểm tra logDetails JSON:**
```json
{
  "transferId": "TRF001",
  "fromAccountId": "ACC001",
  "fromAccountName": "Tiền mặt",
  "toAccountId": "ACC004",
  "toAccountName": "Techcombank",
  "amount": 2000000,
  "fromBalanceBefore": 5000000,
  "fromBalanceAfter": 3000000,
  "toBalanceBefore": 10000000,
  "toBalanceAfter": 12000000,
  "description": "Chuyển tiền đầu tư",
  "transferDate": "2025-10-29T03:30:00.000Z",
  "userId": "USR001",
  "userName": "Admin"
}
```

---

## 🎯 KẾT LUẬN

Phase 2 đã hoàn thành với đầy đủ tính năng:

✅ **Quản lý tài khoản:**
- Thêm/Sửa/Xóa tài khoản
- Hiển thị tổng số dư và số lượng
- Validation đầy đủ

✅ **Chuyển tiền:**
- Chuyển tiền giữa tài khoản với atomic transaction
- Kiểm tra số dư trước khi chuyển
- Tự động cập nhật số dư 2 tài khoản
- Lưu lịch sử đầy đủ trong AUDIT_LOG

✅ **UI/UX:**
- Giao diện đẹp với gradient cards
- Modal system hoàn chỉnh
- Responsive mobile
- Format số tiền tự động
- Loading states

✅ **Bảo mật:**
- Kiểm tra session trước mọi thao tác
- Validation đầy đủ trước khi ghi dữ liệu
- Không cho xóa tài khoản có giao dịch
- Audit log đầy đủ

---

## 📌 GHI CHÚ QUAN TRỌNG

1. **Không sửa số dư trực tiếp trong sheet:**
   - Số dư chỉ thay đổi qua giao dịch hoặc chuyển tiền
   - Nếu sửa trực tiếp → Mất audit trail

2. **Rollback transaction:**
   - Hiện tại nếu transfer fail → Throw error
   - Cần cẩn thận với lock/race condition
   - Trong production nên dùng Apps Script Lock Service

3. **Cache data:**
   - Data load 1 lần khi đăng nhập
   - Mọi thay đổi cập nhật cả cache và server
   - Nếu nhiều user → Cần refresh mechanism

4. **Performance:**
   - Với < 100 tài khoản → Performance tốt
   - Với > 1000 tài khoản → Cần pagination

---

## 🚀 NEXT STEPS - PHASE 3

Sau khi test Phase 2 thành công, chúng ta sẽ phát triển:

**Phase 3: Module Thu nhập & Chi tiêu**
- CRUD thu nhập/chi tiêu
- Tích hợp với tài khoản (chọn tài khoản thanh toán)
- Tự động cập nhật số dư tài khoản khi tạo giao dịch
- Categorization với danh mục
- Filter theo ngày/tháng/danh mục

---

**HẾT HƯỚNG DẪN PHASE 2**

Nếu gặp vấn đề gì trong quá trình tích hợp, hãy report lại với:
1. Thao tác đang thực hiện
2. Kết quả thực tế
3. Kết quả mong đợi
4. Screenshot lỗi (nếu có)
5. Console log (F12 → Console)
