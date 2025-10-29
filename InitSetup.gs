/**
 * =====================================================
 * FILE: InitSetup.gs
 * MÔ TẢ: Tạo các sheet và dữ liệu mẫu
 * ⚠️ QUAN TRỌNG: CHẠY HÀM initializeApp() MỘT LẦN DUY NHẤT
 * SAU ĐÓ XÓA FILE NÀY ĐI!
 * =====================================================
 */

// ==================== HÀM CHÍNH - CHẠY 1 LẦN ====================

function initializeApp() {
  var ui = SpreadsheetApp.getUi();

  var response = ui.alert(
    'Khởi tạo ứng dụng',
    'Bạn có chắc chắn muốn tạo tất cả các sheet và dữ liệu mẫu?\n\nLưu ý: Hàm này chỉ chạy 1 lần duy nhất!',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    ui.alert('Đã hủy khởi tạo');
    return;
  }

  try {
    ui.alert('Bắt đầu khởi tạo...\nQuá trình có thể mất 30-60 giây.');

    // 1. Tạo các sheet
    createAllSheets();

    // 2. Tạo dữ liệu mẫu
    createSampleData();

    ui.alert('✅ Khởi tạo thành công!\n\nBạn có thể:\n1. Test ứng dụng\n2. XÓA FILE InitSetup.gs này\n\nTài khoản mặc định:\nUsername: admin\nPassword: admin123');

  } catch (error) {
    ui.alert('❌ Lỗi: ' + error.toString());
    logError('initializeApp error', error);
  }
}

// ==================== TẠO TẤT CẢ CÁC SHEET ====================

function createAllSheets() {
  var ss = getSpreadsheet();
  var config = getConfig();

  // Xóa sheet mặc định nếu có
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // 1. Cài đặt
  createSettingsSheet(ss, config.SHEETS.SETTINGS);

  // 2. Người dùng
  createUsersSheet(ss, config.SHEETS.USERS);

  // 3. Tài khoản
  createAccountsSheet(ss, config.SHEETS.ACCOUNTS);

  // 4. Thu nhập
  createIncomeSheet(ss, config.SHEETS.INCOME);

  // 5. Chi tiêu
  createExpenseSheet(ss, config.SHEETS.EXPENSE);

  // 6. Ngân sách
  createBudgetSheet(ss, config.SHEETS.BUDGET);

  // 7. Khoản vay
  createLoanSheet(ss, config.SHEETS.LOAN);

  // 8. Đầu tư
  createInvestmentSheet(ss, config.SHEETS.INVESTMENT);

  // 9. Thu chi hộ
  createThirdPartySheet(ss, config.SHEETS.THIRD_PARTY);

  // 10. AI Chat History
  createAIChatSheet(ss, config.SHEETS.AI_CHAT);

  // 11. Notifications
  createNotificationsSheet(ss, config.SHEETS.NOTIFICATIONS);

  // 12. Audit Log
  createAuditLogSheet(ss, config.SHEETS.AUDIT_LOG);

  logInfo('Đã tạo tất cả các sheet');
}

// ==================== 1. SHEET CÀI ĐẶT ====================

function createSettingsSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  // Headers
  var headers = ['ID', 'Type', 'ParentID', 'Name', 'Icon', 'Color', 'UserID', 'Status', 'SortOrder', 'CreatedAt', 'UpdatedAt'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Format header
  formatHeader(sheet, headers.length);
}

// ==================== 2. SHEET NGƯỜI DÙNG ====================

function createUsersSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['UserID', 'Tên đăng nhập', 'Mật khẩu', 'Họ và tên', 'Email', 'Quyền', 'Tình trạng', 'userMetadata'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 3. SHEET TÀI KHOẢN ====================

function createAccountsSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['AccountID', 'Loại', 'Tên tài khoản', 'Số dư đầu kỳ', 'Số dư hiện tại', 'Metadata'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 4. SHEET THU NHẬP ====================

function createIncomeSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'Ngày', 'Danh mục thu nhập', 'Số tiền', 'Mô tả', 'Phương thức thanh toán', 'UserID', 'Metadata'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 5. SHEET CHI TIÊU ====================

function createExpenseSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'Ngày', 'Danh mục chi tiêu', 'Số tiền', 'Mô tả', 'Phương thức thanh toán', 'UserID', 'Metadata'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 6. SHEET NGÂN SÁCH ====================

function createBudgetSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'UserID', 'Tháng', 'Danh mục ID', 'Kế hoạch', 'Chi tiêu', 'Chênh lệch', 'Metadata'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 7. SHEET KHOẢN VAY ====================

function createLoanSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'UserID', 'Ngày vay', 'Hạn trả vay', 'Danh mục vay', 'Giá trị vay', 'Lãi suất vay/năm', 'Tiền gốc trả hàng tháng', 'Tiền lãi trả hàng tháng', 'Tiền gốc đã trả', 'Tiền vay còn lại', 'Tình trạng', 'Chi tiết khoản vay'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 8. SHEET ĐẦU TƯ ====================

function createInvestmentSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'UserID', 'Ngày đầu tư', 'Danh mục đầu tư', 'Giá trị đầu tư', 'Vốn tự có', 'Vốn vay', 'Giá trị hiện tại', 'Kết quả đầu tư', 'Tình trạng', 'Chi tiết đầu tư'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 9. SHEET THU CHI HỘ ====================

function createThirdPartySheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['ID', 'UserID', 'Ngày', 'Dạng', 'Số tiền', 'Nội dung', 'Chi tiết'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 10. SHEET AI CHAT ====================

function createAIChatSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['chatID', 'userID', 'Thời gian', 'chatData'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 11. SHEET NOTIFICATIONS ====================

function createNotificationsSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['notificationId', 'userId', 'type', 'notificationData'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== 12. SHEET AUDIT LOG ====================

function createAuditLogSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }

  var headers = ['logId', 'Thời gian', 'userId', 'action', 'resource', 'resourceId', 'logDetails'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
}

// ==================== FORMAT HEADER ====================

function formatHeader(sheet, numColumns) {
  var headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setBackground('#2c3e50');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  for (var i = 1; i <= numColumns; i++) {
    sheet.autoResizeColumn(i);
  }
}

// ==================== TẠO DỮ LIỆU MẪU ====================

function createSampleData() {
  // 1. Tạo categories trước
  createSampleCategories();

  // 2. Tạo users
  createSampleUsers();

  // 3. Tạo accounts
  createSampleAccounts();

  // 4. Tạo thu nhập
  createSampleIncome();

  // 5. Tạo chi tiêu
  createSampleExpense();

  // 6. Tạo ngân sách
  createSampleBudget();

  logInfo('Đã tạo dữ liệu mẫu');
}

// ==================== DỮ LIỆU MẪU: CATEGORIES ====================

function createSampleCategories() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.SETTINGS);

  var categories = [
    // Chi tiêu
    ['CAT_EXP_001', 'expense', '', 'Ăn uống', '🍔', '#e94849', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_002', 'expense', 'CAT_EXP_001', 'Ăn sáng', '🥐', '#e94849', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_003', 'expense', 'CAT_EXP_001', 'Ăn trưa', '🍜', '#e94849', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_004', 'expense', 'CAT_EXP_001', 'Ăn tối', '🍽️', '#e94849', 'USR001', 'active', 3, new Date().toISOString(), new Date().toISOString()],

    ['CAT_EXP_005', 'expense', '', 'Di chuyển', '🚗', '#3782f4', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_006', 'expense', 'CAT_EXP_005', 'Xăng xe', '⛽', '#3782f4', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_007', 'expense', 'CAT_EXP_005', 'Gửi xe', '🅿️', '#3782f4', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],

    ['CAT_EXP_008', 'expense', '', 'Sinh hoạt', '🏠', '#f99d07', 'USR001', 'active', 3, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_009', 'expense', 'CAT_EXP_008', 'Tiền điện', '💡', '#f99d07', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_EXP_010', 'expense', 'CAT_EXP_008', 'Tiền nước', '💧', '#f99d07', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],

    // Thu nhập
    ['CAT_INC_001', 'income', '', 'Lương', '💰', '#24c560', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_INC_002', 'income', '', 'Thưởng', '🎁', '#24c560', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],
    ['CAT_INC_003', 'income', '', 'Làm thêm', '💼', '#24c560', 'USR001', 'active', 3, new Date().toISOString(), new Date().toISOString()],

    // Ngân sách
    ['CAT_BUD_001', 'budget', '', 'Ăn uống', '🍔', '#e94849', 'USR001', 'active', 1, new Date().toISOString(), new Date().toISOString()],
    ['CAT_BUD_002', 'budget', '', 'Di chuyển', '🚗', '#3782f4', 'USR001', 'active', 2, new Date().toISOString(), new Date().toISOString()],
    ['CAT_BUD_003', 'budget', '', 'Sinh hoạt', '🏠', '#f99d07', 'USR001', 'active', 3, new Date().toISOString(), new Date().toISOString()]
  ];

  for (var i = 0; i < categories.length; i++) {
    sheet.appendRow(categories[i]);
  }
}

// ==================== DỮ LIỆU MẪU: USERS ====================

function createSampleUsers() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.USERS);

  var metadata = {
    phone: '0901234567',
    avatar: '',
    resetToken: null,
    resetTokenExpiry: null,
    loginAttempts: 0,
    lastLoginAttempt: null,
    lastLogin: null,
    createdAt: new Date().toISOString(),
    createdBy: 'SYSTEM',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'vi'
    }
  };

  var users = [
    ['USR001', 'admin', hashPassword('admin123'), 'Nguyễn Văn A', 'admin@example.com', 'Admin', 'Active', JSON.stringify(metadata)],
    ['USR002', 'user1', hashPassword('user123'), 'Trần Thị B', 'user1@example.com', 'User', 'Active', JSON.stringify(metadata)]
  ];

  for (var i = 0; i < users.length; i++) {
    sheet.appendRow(users[i]);
  }
}

// ==================== DỮ LIỆU MẪU: ACCOUNTS ====================

function createSampleAccounts() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.ACCOUNTS);

  var accounts = [
    ['ACC001', 'Tiền mặt', 'Tiền mặt', 5000000, 5000000, JSON.stringify({})],
    ['ACC002', 'Ngân hàng', 'ACB', 20000000, 20000000, JSON.stringify({ accountNumber: '123456789' })],
    ['ACC003', 'Ngân hàng', 'VCB', 15000000, 15000000, JSON.stringify({ accountNumber: '987654321' })],
    ['ACC004', 'Ví điện tử', 'Momo', 2000000, 2000000, JSON.stringify({ phone: '0901234567' })]
  ];

  for (var i = 0; i < accounts.length; i++) {
    sheet.appendRow(accounts[i]);
  }
}

// ==================== DỮ LIỆU MẪU: THU NHẬP ====================

function createSampleIncome() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.INCOME);

  var metadata = {
    source: 'salary',
    attachments: [],
    tags: ['monthly', 'recurring'],
    thirdParty: { isForOthers: false, personName: null },
    aiData: { autoClassified: false, confidence: 1 },
    auditLog: {
      createdBy: 'USR001',
      createdAt: new Date().toISOString(),
      updatedBy: 'USR001',
      updatedAt: new Date().toISOString()
    }
  };

  var incomes = [
    ['TN00001', '15/10/2025', JSON.stringify([{ id: 'CAT_INC_001', name: 'Lương' }]), 15000000, 'Lương tháng 10', JSON.stringify([{ id: 'ACC002', name: 'ACB' }]), 'USR001', JSON.stringify(metadata)]
  ];

  for (var i = 0; i < incomes.length; i++) {
    sheet.appendRow(incomes[i]);
  }
}

// ==================== DỮ LIỆU MẪU: CHI TIÊU ====================

function createSampleExpense() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.EXPENSE);

  var metadata = {
    source: 'manual',
    attachments: [],
    tags: [],
    thirdParty: { isForOthers: false, personName: null },
    aiData: { autoClassified: false, confidence: 1 },
    auditLog: {
      createdBy: 'USR001',
      createdAt: new Date().toISOString(),
      updatedBy: 'USR001',
      updatedAt: new Date().toISOString()
    }
  };

  var expenses = [
    ['CT00001', '16/10/2025', JSON.stringify([{ id: 'CAT_EXP_002', name: 'Ăn sáng' }]), 50000, 'Bánh mì', JSON.stringify([{ id: 'ACC001', name: 'Tiền mặt' }]), 'USR001', JSON.stringify(metadata)],
    ['CT00002', '16/10/2025', JSON.stringify([{ id: 'CAT_EXP_003', name: 'Ăn trưa' }]), 80000, 'Cơm văn phòng', JSON.stringify([{ id: 'ACC001', name: 'Tiền mặt' }]), 'USR001', JSON.stringify(metadata)]
  ];

  for (var i = 0; i < expenses.length; i++) {
    sheet.appendRow(expenses[i]);
  }
}

// ==================== DỮ LIỆU MẪU: NGÂN SÁCH ====================

function createSampleBudget() {
  var config = getConfig();
  var sheet = getSheetByName(config.SHEETS.BUDGET);

  var currentMonth = getCurrentMonth();

  var metadata = {
    categoryName: 'Ăn uống',
    remaining: 4870000,
    percentage: 2.6,
    status: 'on-track',
    alerts: [],
    updatedAt: new Date().toISOString()
  };

  var budgets = [
    ['NS00001', 'USR001', currentMonth, JSON.stringify([{ id: 'CAT_BUD_001', name: 'Ăn uống' }]), 5000000, 130000, 2.6, JSON.stringify(metadata)]
  ];

  for (var i = 0; i < budgets.length; i++) {
    sheet.appendRow(budgets[i]);
  }
}
