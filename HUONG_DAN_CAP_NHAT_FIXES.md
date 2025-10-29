# 🔧 HƯỚNG DẪN CẬP NHẬT FIXES CHO PHASE 1

## ✅ TÓM TẮT CÁC LỖI ĐÃ FIX

### **Lỗi 1: Dashboard hiển thị 0₫ sau navigation/login lại** ✅ ĐÃ FIX
- **Nguyên nhân:** Logic filter ngày tháng sai
- **Chi tiết:**
  - Dữ liệu: "16/10/2025" (format dd/MM/yyyy)
  - Check cũ: `.startsWith("2025/10")` → FALSE ❌
- **Giải pháp:** Parse date và so sánh tháng/năm đúng cách
- **File fix:** `App.js.html`

### **Lỗi 2: Logout hiện trang nhúng thay vì modal** ✅ ĐÃ FIX
- **Nguyên nhân:** Dùng `confirm()` native browser
- **Giải pháp:** Đổi sang `showConfirm()` modal custom
- **Bonus:** Thêm loading state và success modal
- **File fix:** `Index.html`

### **Lỗi 3: Thiếu chức năng đổi mật khẩu** ✅ ĐÃ FIX
- **Giải pháp:**
  - Thêm user dropdown menu với "Đổi mật khẩu" và "Đăng xuất"
  - Modal form đổi mật khẩu với validation
  - Auto logout sau khi đổi thành công
- **File fix:** `Styles.html`, `Index.html`

---

## 📦 FILES CẦN CẬP NHẬT

Bạn cần cập nhật **3 files** trong Google Apps Script:

| # | File | Thay đổi | Dòng code |
|---|------|----------|-----------|
| 1 | `App.js.html` | Fix logic dashboard | +47 dòng |
| 2 | `Index.html` | Dropdown + Change Password | +180 dòng |
| 3 | `Styles.html` | CSS dropdown | +75 dòng |

**Tổng:** 3 files, 325 dòng thêm, 28 dòng xóa

---

## 🚀 CÁCH CẬP NHẬT

### **Option 1: Cập nhật thủ công (Khuyên dùng - Nhanh nhất)**

#### **Bước 1: Mở Apps Script Editor**
1. Vào Google Sheet của bạn
2. Extensions → Apps Script

#### **Bước 2: Cập nhật file App.js.html**

1. Click vào file **`App.js`** (hay `App.js.html`)
2. Tìm function `updateDashboard()` (khoảng dòng 91)
3. **XÓA** toàn bộ function cũ (từ `function updateDashboard()` đến hết dấu `}`)
4. **DÁN** code mới:

```javascript
// ==================== UPDATE DASHBOARD ====================

function updateDashboard() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11
  const currentYear = now.getFullYear();

  // Helper function để check tháng hiện tại
  function isCurrentMonth(dateString) {
    if (!dateString) return false;
    const date = parseVietnameseDate(dateString);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }

  // Tính tổng thu nhập tháng này
  const totalIncome = APP_DATA.income
    .filter(item => isCurrentMonth(item['Ngày']))
    .reduce((sum, item) => sum + parseFloat(item['Số tiền'] || 0), 0);

  // Tính tổng chi tiêu tháng này
  const totalExpense = APP_DATA.expense
    .filter(item => isCurrentMonth(item['Ngày']))
    .reduce((sum, item) => sum + parseFloat(item['Số tiền'] || 0), 0);

  // Tính tiết kiệm
  const totalSaving = totalIncome - totalExpense;

  // Tính tổng tài sản (số dư hiện tại của tất cả tài khoản)
  const totalAssets = APP_DATA.accounts
    .reduce((sum, item) => sum + parseFloat(item['Số dư hiện tại'] || 0), 0);

  // Update UI
  document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
  document.getElementById('totalExpense').textContent = formatCurrency(totalExpense);
  document.getElementById('totalSaving').textContent = formatCurrency(totalSaving);
  document.getElementById('totalAssets').textContent = formatCurrency(totalAssets);

  // Log để debug
  console.log('Dashboard updated:', {
    currentMonth: currentMonth + 1,
    currentYear: currentYear,
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    totalSaving: totalSaving,
    totalAssets: totalAssets
  });

  // Update recent transactions
  updateRecentTransactions();
}
```

5. **Ctrl+S** để save

#### **Bước 3: Cập nhật file Styles.html**

1. Click vào file **`Styles`** (hay `Styles.html`)
2. Tìm đoạn `.user-role {` (khoảng dòng 200)
3. Sau dòng `}` của `.user-role`, **THÊM VÀO** code này:

```css
/* User Dropdown */
.user-dropdown {
  position: relative;
}

.user-dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.user-dropdown-toggle:hover {
  background-color: var(--light-color);
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background-color: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: var(--transition);
  z-index: 1000;
}

.user-dropdown.active .user-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-dropdown-menu a,
.user-dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--dark-color);
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
}

.user-dropdown-menu a:hover,
.user-dropdown-menu button:hover {
  background-color: var(--light-color);
}

.user-dropdown-menu a i,
.user-dropdown-menu button i {
  width: 18px;
  text-align: center;
}

.user-dropdown-divider {
  height: 1px;
  background-color: var(--light-color);
  margin: 8px 0;
}
```

4. **Ctrl+S** để save

#### **Bước 4: Cập nhật file Index.html**

Cập nhật file này phức tạp hơn, có 2 phần cần sửa:

##### **Phần 4.1: Sửa Header (User Dropdown)**

1. Click vào file **`Index`** (hay `Index.html`)
2. Tìm đoạn `<div class="header-right">` (khoảng dòng 32)
3. **XÓA** toàn bộ từ `<div class="header-right">` đến `</div>` (khoảng 18 dòng)
4. **DÁN** code mới:

```html
        <div class="header-right">
          <!-- User Dropdown -->
          <div class="user-dropdown" id="userDropdown">
            <button class="user-dropdown-toggle" onclick="toggleUserDropdown()">
              <div class="user-avatar">
                <?= session.fullName ? session.fullName.charAt(0).toUpperCase() : 'U' ?>
              </div>
              <div class="user-details">
                <div class="user-name"><?= session.fullName || 'User' ?></div>
                <div class="user-role"><?= session.role || 'User' ?></div>
              </div>
              <i class="fas fa-chevron-down" style="font-size: 12px; color: var(--gray-color);"></i>
            </button>

            <!-- Dropdown Menu -->
            <div class="user-dropdown-menu">
              <button onclick="showChangePasswordModal()">
                <i class="fas fa-key"></i>
                <span>Đổi mật khẩu</span>
              </button>
              <div class="user-dropdown-divider"></div>
              <button onclick="handleLogout()" style="color: var(--danger-color);">
                <i class="fas fa-sign-out-alt"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
```

##### **Phần 4.2: Sửa JavaScript handlers**

1. Scroll xuống cuối file, tìm function `handleLogout()` (khoảng dòng 180)
2. **XÓA** toàn bộ function `handleLogout()` cũ
3. **DÁN** code mới (TOÀN BỘ đoạn dưới đây):

```javascript
    // Toggle User Dropdown
    function toggleUserDropdown() {
      const dropdown = document.getElementById('userDropdown');
      dropdown.classList.toggle('active');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('userDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Show Change Password Modal
    function showChangePasswordModal() {
      // Close user dropdown
      document.getElementById('userDropdown').classList.remove('active');

      const modalContainer = document.getElementById('modalContainer');
      modalContainer.innerHTML = `
        <div class="modal-overlay show" id="changePasswordModal">
          <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">
                <i class="fas fa-key text-primary"></i>
                Đổi mật khẩu
              </h3>
              <button class="modal-close" onclick="closeModal()">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form id="changePasswordForm" onsubmit="handleChangePassword(event)">
              <div class="modal-body">
                <!-- Old Password -->
                <div class="form-group">
                  <label class="form-label required">Mật khẩu hiện tại</label>
                  <div class="input-group" style="position: relative;">
                    <i class="fas fa-lock input-group-icon"></i>
                    <input
                      type="password"
                      id="oldPassword"
                      class="form-control"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                      style="padding-left: 45px;"
                    >
                  </div>
                </div>

                <!-- New Password -->
                <div class="form-group">
                  <label class="form-label required">Mật khẩu mới</label>
                  <div class="input-group" style="position: relative;">
                    <i class="fas fa-key input-group-icon"></i>
                    <input
                      type="password"
                      id="newPassword"
                      class="form-control"
                      placeholder="Nhập mật khẩu mới"
                      required
                      minlength="6"
                      style="padding-left: 45px;"
                    >
                  </div>
                  <small style="color: var(--gray-color); font-size: 12px;">Tối thiểu 6 ký tự</small>
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                  <label class="form-label required">Xác nhận mật khẩu mới</label>
                  <div class="input-group" style="position: relative;">
                    <i class="fas fa-check-circle input-group-icon"></i>
                    <input
                      type="password"
                      id="confirmPassword"
                      class="form-control"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minlength="6"
                      style="padding-left: 45px;"
                    >
                  </div>
                </div>

                <div id="passwordError" class="hidden" style="padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-top: 10px; font-size: 13px;">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                  <i class="fas fa-times"></i> Hủy
                </button>
                <button type="submit" class="btn btn-primary" id="changePasswordBtn">
                  <i class="fas fa-check"></i>
                  <span id="changePasswordBtnText">Đổi mật khẩu</span>
                  <span id="changePasswordBtnLoading" class="loading hidden" style="border-top-color: white;"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    // Handle Change Password
    function handleChangePassword(event) {
      event.preventDefault();

      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorDiv = document.getElementById('passwordError');

      // Validate
      if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
        errorDiv.classList.remove('hidden');
        return;
      }

      if (newPassword === oldPassword) {
        errorDiv.textContent = 'Mật khẩu mới phải khác mật khẩu hiện tại!';
        errorDiv.classList.remove('hidden');
        return;
      }

      // Hide error
      errorDiv.classList.add('hidden');

      // Show loading
      const btn = document.getElementById('changePasswordBtn');
      const btnText = document.getElementById('changePasswordBtnText');
      const btnLoading = document.getElementById('changePasswordBtnLoading');

      btn.disabled = true;
      btnText.classList.add('hidden');
      btnLoading.classList.remove('hidden');

      // Call server
      google.script.run
        .withSuccessHandler(function(response) {
          btn.disabled = false;
          btnText.classList.remove('hidden');
          btnLoading.classList.add('hidden');

          if (response.success) {
            closeModal();
            showModal('Thành công', 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success');

            // Redirect to login after 2 seconds
            setTimeout(function() {
              window.location.href = '<?= ScriptApp.getService().getUrl() ?>?page=login';
            }, 2000);
          } else {
            errorDiv.textContent = response.message;
            errorDiv.classList.remove('hidden');
          }
        })
        .withFailureHandler(function(error) {
          btn.disabled = false;
          btnText.classList.remove('hidden');
          btnLoading.classList.add('hidden');

          errorDiv.textContent = 'Lỗi kết nối: ' + error.message;
          errorDiv.classList.remove('hidden');
        })
        .handleChangePassword(oldPassword, newPassword);
    }

    // Handle Logout
    function handleLogout() {
      // Close user dropdown if open
      const dropdown = document.getElementById('userDropdown');
      if (dropdown) {
        dropdown.classList.remove('active');
      }

      showConfirm(
        'Xác nhận đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        function() {
          // User confirmed - proceed with logout
          showLoading('Đang đăng xuất...');

          google.script.run
            .withSuccessHandler(function(response) {
              hideLoading();
              if (response.success) {
                showModal('Thành công', 'Đăng xuất thành công!', 'success');
                setTimeout(function() {
                  window.location.href = '<?= ScriptApp.getService().getUrl() ?>?page=login';
                }, 1000);
              }
            })
            .withFailureHandler(function(error) {
              hideLoading();
              showModal('Lỗi', 'Không thể đăng xuất: ' + error.message, 'danger');
            })
            .handleLogout();
        },
        function() {
          // User cancelled - do nothing
          console.log('Logout cancelled');
        }
      );
    }
```

4. **Ctrl+S** để save

#### **Bước 5: Deploy lại Web App**

1. Click nút **Deploy** (góc trên bên phải)
2. Chọn **Manage deployments**
3. Click icon **Pencil** (✏️) bên cạnh deployment hiện tại
4. Ở phần "Version", chọn **New version**
5. Description: "Fix bugs: Dashboard 0đ, Logout modal, Change password"
6. Click **Deploy**
7. Copy URL mới (hoặc dùng URL cũ vẫn được)

---

### **Option 2: Copy toàn bộ file mới (Backup cũ trước)**

Nếu bạn muốn chắc chắn, copy toàn bộ 3 files từ repo:

1. Backup files cũ (copy sang notepad)
2. Copy toàn bộ nội dung từ:
   - `/home/user/dung/App.js.html`
   - `/home/user/dung/Index.html`
   - `/home/user/dung/Styles.html`
3. Paste vào Apps Script
4. Save và Deploy

---

## 🧪 TEST SAU KHI CẬP NHẬT

### **Test 1: Dashboard hiển thị đúng số liệu ✅**

1. Login với `admin/admin123`
2. **Kết quả mong đợi:**
   - Thu nhập tháng này: **15,000,000₫** ✅
   - Chi tiêu tháng này: **130,000₫** ✅
   - Tiết kiệm: **14,870,000₫** ✅
   - Tổng tài sản: **42,000,000₫** ✅

3. Click vào menu "Chi tiêu" rồi quay lại "Trang chủ"
4. **Kết quả mong đợi:** Số liệu vẫn hiển thị đúng (không về 0₫) ✅

5. Logout và login lại
6. **Kết quả mong đợi:** Số liệu vẫn hiển thị đúng ✅

### **Test 2: Logout hiện modal ✅**

1. Click nút user dropdown (avatar + tên)
2. **Kết quả mong đợi:** Menu dropdown hiện ra ✅

3. Click "Đăng xuất"
4. **Kết quả mong đợi:**
   - Modal confirm hiện ra (không phải trang nhúng browser) ✅
   - Có nút "Hủy" và "Xác nhận" ✅

5. Click "Xác nhận"
6. **Kết quả mong đợi:**
   - Loading overlay "Đang đăng xuất..." ✅
   - Modal "Đăng xuất thành công!" ✅
   - Redirect về trang login sau 1s ✅

### **Test 3: Đổi mật khẩu hoạt động ✅**

1. Login với `admin/admin123`
2. Click user dropdown
3. Click "Đổi mật khẩu"
4. **Kết quả mong đợi:** Modal form đổi mật khẩu hiện ra ✅

5. Test case: Nhập sai mật khẩu hiện tại
   - Old: `wrongpass`
   - New: `newpass123`
   - Confirm: `newpass123`
   - Click "Đổi mật khẩu"
   - **Kết quả mong đợi:** Error "Mật khẩu cũ không đúng" ✅

6. Test case: Mật khẩu mới không khớp
   - Old: `admin123`
   - New: `newpass123`
   - Confirm: `different123`
   - **Kết quả mong đợi:** Error "Mật khẩu mới và xác nhận không khớp!" ✅

7. Test case: Đổi thành công
   - Old: `admin123`
   - New: `admin456`
   - Confirm: `admin456`
   - Click "Đổi mật khẩu"
   - **Kết quả mong đợi:**
     - Loading spinner ✅
     - Modal "Đổi mật khẩu thành công!" ✅
     - Redirect về login sau 2s ✅

8. Login lại với password mới: `admin456`
9. **Kết quả mong đợi:** Đăng nhập thành công ✅

10. **LƯU Ý:** Nhớ đổi lại password về `admin123` để giữ nguyên!

---

## 📊 CHECKLIST CẬP NHẬT

- [ ] Đã backup 3 files cũ (App.js, Index, Styles)
- [ ] Đã cập nhật file `App.js.html` - Fix dashboard
- [ ] Đã cập nhật file `Styles.html` - CSS dropdown
- [ ] Đã cập nhật file `Index.html` - Dropdown + Change Password
- [ ] Đã save tất cả files (Ctrl+S)
- [ ] Đã deploy version mới
- [ ] Test dashboard hiển thị đúng ✅
- [ ] Test navigation không làm mất số liệu ✅
- [ ] Test logout hiện modal đúng ✅
- [ ] Test đổi mật khẩu thành công ✅
- [ ] Đã đổi lại password về `admin123`

---

## ❓ NẾU GẶP LỖI

### **Lỗi: "Syntax Error" khi save**
→ Kiểm tra lại code đã copy đúng chưa, không thiếu dấu `{`, `}`, `)`, `(`

### **Lỗi: Dashboard vẫn hiển thị 0₫**
→ Xóa cache browser (Ctrl+F5) và refresh lại

### **Lỗi: Dropdown không hiện**
→ Kiểm tra đã update cả file `Styles.html` chưa

### **Lỗi: "handleChangePassword is not defined"**
→ Kiểm tra đã update phần JavaScript trong `Index.html` chưa

### **Lỗi khi deploy: "Authorization required"**
→ Authorize lại và deploy

---

## 🎉 KẾT QUẢ SAU KHI CẬP NHẬT

✅ Dashboard luôn hiển thị đúng số liệu (không về 0₫)
✅ Logout dùng modal đẹp mắt (không trang nhúng)
✅ Có chức năng đổi mật khẩu an toàn
✅ User dropdown với menu dropdown chuyên nghiệp
✅ Tăng trải nghiệm người dùng (UX)

---

**Nếu cập nhật thành công, hãy báo cho tôi:**

✅ **"Đã cập nhật xong, test OK!"**

Hoặc nếu có lỗi:

❌ **"Gặp lỗi [mô tả]"** + kèm screenshot

Chúc bạn cập nhật thành công! 🚀
