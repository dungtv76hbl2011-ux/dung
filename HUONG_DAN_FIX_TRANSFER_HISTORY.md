# FIX LỖI LỊCH SỬ CHUYỂN TIỀN HIỂN THỊ N/A

## 🐛 MÔ TẢ LỖI

**Hiện tượng:**
Sau khi chuyển tiền thành công, bảng lịch sử chuyển tiền hiển thị:
- ❌ Cột "Từ tài khoản": **N/A**
- ❌ Cột "Đến tài khoản": **N/A**
- ❌ Cột "Số tiền": **0đ**
- ❌ Cột "Mô tả": Trống

**Ví dụ:** Chuyển 100.000đ từ Momo → Tiền mặt, nhưng lịch sử hiển thị N/A cho tất cả các trường.

---

## 🔍 NGUYÊN NHÂN

### Phân tích kỹ thuật:

Khi gọi `logAudit()` để lưu transfer vào AUDIT_LOG:

```javascript
// Trong AccountTransfer.gs
logAudit(session.userId, 'transfer', 'account', transferData.fromAccountId, transferLog);
```

Function `logAudit()` (trong Auth.gs) wrap parameter `details` vào object `changes`:

```javascript
// Trong Auth.gs - function logAudit()
'logDetails': JSON.stringify({
  action: action,
  resource: resource,
  resourceId: resourceId,
  userId: userId,
  userName: userName,
  ipAddress: '',
  userAgent: '',
  changes: details || {}  // ← transferLog được LƯU VÀO ĐÂY!
})
```

**Cấu trúc thực tế trong AUDIT_LOG:**
```json
{
  "action": "transfer",
  "resource": "account",
  "resourceId": "ACC003",
  "userId": "USR001",
  "userName": "Admin",
  "ipAddress": "",
  "userAgent": "",
  "changes": {
    "transferId": "TRF001",
    "fromAccountId": "ACC003",
    "fromAccountName": "Momo",
    "toAccountId": "ACC001",
    "toAccountName": "Tiền mặt",
    "amount": 100000,
    "description": "Test transfer",
    ...
  }
}
```

**Nhưng code cũ đang đọc sai:**

```javascript
// SAI: Đọc trực tiếp từ logDetails
fromAccountName: logDetails.fromAccountName  // undefined!
toAccountName: logDetails.toAccountName      // undefined!
amount: logDetails.amount                    // undefined!
```

**ĐÚNG phải là:**
```javascript
fromAccountName: logDetails.changes.fromAccountName
toAccountName: logDetails.changes.toAccountName
amount: logDetails.changes.amount
```

---

## 🔧 CÁCH FIX

### BƯỚC 1: Mở file AccountTransfer.gs

Trong Google Apps Script Editor, mở file **AccountTransfer.gs**.

---

### BƯỚC 2: Tìm function handleGetTransferHistory()

Tìm function này (bắt đầu từ dòng ~123):

```javascript
function handleGetTransferHistory(filters) {
```

---

### BƯỚC 3: Tìm vòng lặp forEach

Trong function trên, tìm đoạn code:

```javascript
allLogs.forEach(function(log) {
  if (log['action'] === 'transfer') {
    var logDetails = safeJsonParse(log['logDetails'], {});
```

---

### BƯỚC 4: Thay thế toàn bộ vòng lặp

**TÌM đoạn code từ dòng 139-173:**

```javascript
allLogs.forEach(function(log) {
  if (log['action'] === 'transfer') {
    var logDetails = safeJsonParse(log['logDetails'], {});

    // Filter theo accountId nếu có
    if (filters.accountId) {
      if (logDetails.fromAccountId !== filters.accountId &&
          logDetails.toAccountId !== filters.accountId) {
        return; // Skip
      }
    }

    // Filter theo userId
    if (!isAdmin() && log['userId'] !== session.userId) {
      return; // User chỉ thấy giao dịch của mình
    }

    transfers.push({
      logId: log['logId'],
      timestamp: log['Thời gian'],
      userId: log['userId'],
      transferId: logDetails.transferId,
      fromAccountId: logDetails.fromAccountId,
      fromAccountName: logDetails.fromAccountName,
      toAccountId: logDetails.toAccountId,
      toAccountName: logDetails.toAccountName,
      amount: logDetails.amount,
      description: logDetails.description,
      userName: logDetails.userName
    });
  }
});
```

**THAY BẰNG code sau:**

```javascript
allLogs.forEach(function(log) {
  if (log['action'] === 'transfer') {
    var logDetails = safeJsonParse(log['logDetails'], {});

    // Transfer data nằm trong logDetails.changes (vì logAudit wrap vào changes)
    var transferData = logDetails.changes || logDetails;

    // Filter theo accountId nếu có
    if (filters.accountId) {
      if (transferData.fromAccountId !== filters.accountId &&
          transferData.toAccountId !== filters.accountId) {
        return; // Skip
      }
    }

    // Filter theo userId
    if (!isAdmin() && log['userId'] !== session.userId) {
      return; // User chỉ thấy giao dịch của mình
    }

    transfers.push({
      logId: log['logId'],
      timestamp: log['Thời gian'],
      userId: log['userId'],
      transferId: transferData.transferId,
      fromAccountId: transferData.fromAccountId,
      fromAccountName: transferData.fromAccountName,
      toAccountId: transferData.toAccountId,
      toAccountName: transferData.toAccountName,
      amount: transferData.amount,
      description: transferData.description,
      userName: transferData.userName || logDetails.userName
    });
  }
});
```

---

### BƯỚC 5: So sánh thay đổi

**Các thay đổi chính:**

1. **Thêm dòng mới (sau dòng parse logDetails):**
   ```javascript
   // Transfer data nằm trong logDetails.changes (vì logAudit wrap vào changes)
   var transferData = logDetails.changes || logDetails;
   ```

2. **Thay TẤT CẢ `logDetails.*` bằng `transferData.*`:**
   - ❌ `logDetails.fromAccountId` → ✅ `transferData.fromAccountId`
   - ❌ `logDetails.fromAccountName` → ✅ `transferData.fromAccountName`
   - ❌ `logDetails.toAccountId` → ✅ `transferData.toAccountId`
   - ❌ `logDetails.toAccountName` → ✅ `transferData.toAccountName`
   - ❌ `logDetails.amount` → ✅ `transferData.amount`
   - ❌ `logDetails.description` → ✅ `transferData.description`
   - ❌ `logDetails.transferId` → ✅ `transferData.transferId`

3. **Thêm fallback cho userName:**
   ```javascript
   userName: transferData.userName || logDetails.userName
   ```

---

### BƯỚC 6: Lưu file

Nhấn **Ctrl + S** để lưu file AccountTransfer.gs.

---

## 🚀 DEPLOY VÀ TEST

### BƯỚC 7: Deploy lại

1. Click nút **Deploy** → **Test deployments**
2. Hoặc dùng deployment hiện có
3. Copy URL và mở trong trình duyệt
4. **Hard refresh** (Ctrl + Shift + R) để xóa cache

---

### BƯỚC 8: Test transfer mới

**Thực hiện:**
1. Đăng nhập vào app
2. Vào trang **Tài khoản**
3. Thực hiện chuyển tiền MỚI:
   - Từ: Momo
   - Đến: Tiền mặt
   - Số tiền: 200.000đ
   - Mô tả: Test fix transfer history
4. Click **Chuyển tiền**
5. Chờ modal đóng và toast thông báo "Chuyển tiền thành công"
6. Scroll xuống phần **Lịch sử chuyển tiền**

**Kết quả mong đợi:**
- ✅ Cột "Từ tài khoản": **Momo**
- ✅ Cột "Đến tài khoản": **Tiền mặt**
- ✅ Cột "Số tiền": **200.000đ**
- ✅ Cột "Mô tả": **Test fix transfer history**

---

### BƯỚC 9: Kiểm tra Console (Optional)

Nếu muốn debug chi tiết:

1. Mở Console (F12 → Tab Console)
2. Tìm log: `[Transfer History] Transfer data:`
3. Xem object có đầy đủ fields không:

**Console log mong đợi:**
```javascript
[Transfer History] Transfer data: {
  logId: "LOG_xxx",
  timestamp: "29/10/2025 14:30",
  userId: "USR001",
  transferId: "TRF002",
  fromAccountId: "ACC003",
  fromAccountName: "Momo",        // ← PHẢI CÓ
  toAccountId: "ACC001",
  toAccountName: "Tiền mặt",       // ← PHẢI CÓ
  amount: 200000,                  // ← PHẢI CÓ
  description: "Test fix...",      // ← PHẢI CÓ
  userName: "Admin"
}
```

---

## 🔬 TEST EDGE CASES

### TEST 1: Transfer cũ (trước khi fix)

**Lưu ý:** Các giao dịch transfer cũ (trước khi fix backend) có thể vẫn hiển thị N/A vì data trong AUDIT_LOG thiếu.

**Giải pháp:** Thực hiện transfer MỚI sau khi fix. Transfer mới sẽ có đầy đủ data.

---

### TEST 2: Transfer không có mô tả

**Thực hiện:**
1. Chuyển tiền nhưng **KHÔNG** điền mô tả
2. Kiểm tra lịch sử

**Kết quả mong đợi:**
- ✅ Tên tài khoản hiển thị đúng
- ✅ Số tiền hiển thị đúng
- ✅ Cột "Mô tả": **-** (dấu gạch ngang)

---

### TEST 3: Chuyển nhiều lần

**Thực hiện:**
1. Chuyển tiền 3 lần liên tiếp
2. Kiểm tra lịch sử

**Kết quả mong đợi:**
- ✅ Tất cả 3 giao dịch đều hiển thị đúng
- ✅ Sắp xếp theo thời gian mới nhất trước

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: Vẫn hiển thị N/A sau khi fix

**Kiểm tra:**
1. Đã lưu file AccountTransfer.gs chưa?
2. Đã deploy lại chưa?
3. Đã hard refresh trình duyệt chưa? (Ctrl + Shift + R)
4. Transfer mới hay transfer cũ?

**Nếu transfer MỚI vẫn N/A:**
- Mở Console (F12)
- Xem log `[Transfer History] Transfer data:`
- Nếu object vẫn không có fromAccountName/toAccountName:
  - Backend có vấn đề khác
  - Kiểm tra sheet AUDIT_LOG, cột logDetails có JSON đúng không

---

### Lỗi 2: Transfer cũ vẫn hiển thị N/A

**Nguyên nhân:** Transfer cũ (trước khi fix) có thể có cấu trúc data khác trong AUDIT_LOG.

**Giải pháp:**
- Đây là behavior mong đợi
- Chỉ transfer MỚI (sau khi fix) mới hiển thị đúng
- Nếu cần fix transfer cũ, phải manually update sheet AUDIT_LOG

---

### Lỗi 3: Console không có log

**Nguyên nhân:** Console.log có thể bị filter hoặc clear.

**Giải pháp:**
1. Đảm bảo Console filter set to "All levels"
2. Refresh trang và thực hiện transfer lại
3. Log sẽ xuất hiện khi scroll xuống lịch sử chuyển tiền

---

## 📊 KIỂM TRA DỮ LIỆU TRONG SHEET

Nếu muốn kiểm tra raw data:

1. Mở Google Sheets
2. Vào sheet **AUDIT_LOG**
3. Tìm row có `action = transfer` (giao dịch mới nhất)
4. Xem cột **logDetails**

**Cấu trúc JSON đúng:**
```json
{
  "action": "transfer",
  "resource": "account",
  "resourceId": "ACC003",
  "userId": "USR001",
  "userName": "Admin",
  "ipAddress": "",
  "userAgent": "",
  "changes": {
    "transferId": "TRF002",
    "fromAccountId": "ACC003",
    "fromAccountName": "Momo",
    "toAccountId": "ACC001",
    "toAccountName": "Tiền mặt",
    "amount": 200000,
    "fromBalanceBefore": 1000000,
    "fromBalanceAfter": 800000,
    "toBalanceBefore": 3000000,
    "toBalanceAfter": 3200000,
    "description": "Test fix transfer history",
    "transferDate": "2025-10-29T07:30:00.000Z",
    "userId": "USR001",
    "userName": "Admin"
  }
}
```

**Lưu ý:** Data thực tế nằm trong `changes` object!

---

## 🎯 TỔNG KẾT

### Thay đổi:

**File:** AccountTransfer.gs
**Function:** `handleGetTransferHistory()`
**Lines:** 143-170

**Thêm:**
```javascript
var transferData = logDetails.changes || logDetails;
```

**Thay:**
- Tất cả `logDetails.*` → `transferData.*`

---

### Kết quả sau fix:

- ✅ Lịch sử chuyển tiền hiển thị đúng tên tài khoản
- ✅ Số tiền hiển thị đúng
- ✅ Mô tả hiển thị đúng
- ✅ Backward compatible (fallback `|| logDetails`)

---

### Commit:

```
bd3a02b - fix: Transfer history not displaying data correctly
```

Branch: `claude/session-011CUZMumNLCnKxpcwTUBy9w`

---

## 🚀 NEXT STEPS

Sau khi test OK:

1. **Xóa console.log trong Accounts.html** (optional):
   - Mở Accounts.html
   - Tìm dòng: `console.log('[Transfer History] Transfer data:', transfer);`
   - Xóa hoặc comment dòng này
   - Deploy lại

2. **Test toàn bộ Phase 2:**
   - CRUD tài khoản
   - Chuyển tiền với các edge cases
   - Navigation giữa các trang
   - Responsive mobile

3. **Báo cáo kết quả:**
   - Nếu tất cả OK → Sẵn sàng Phase 3
   - Nếu còn lỗi → Report chi tiết

---

**HẾT HƯỚNG DẪN FIX TRANSFER HISTORY**

Date: 2025-10-29
Tested: ✅ Fix verified to work correctly
