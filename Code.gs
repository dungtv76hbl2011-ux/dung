/**
 * =====================================================
 * FILE: Code.gs
 * MÔ TẢ: Main handler - doGet, include, API routing
 * =====================================================
 */

// ==================== MAIN HANDLER ====================

function doGet(e) {
  var page = e.parameter.page || 'login';

  // Kiểm tra session
  var session = getCurrentSession();

  // Nếu chưa login và không phải trang login, redirect về login
  if (!session && page !== 'login') {
    page = 'login';
  }

  // Nếu đã login và đang ở trang login, redirect về home
  if (session && page === 'login') {
    page = 'home';
  }

  try {
    // Load template
    var template = HtmlService.createTemplateFromFile(page === 'login' ? 'Login' : 'Index');

    // Truyền data vào template
    if (session) {
      template.session = session;
      template.config = getConfig();
    }

    // Evaluate và return
    return template.evaluate()
      .setTitle(getConfig().APP_NAME)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');

  } catch (error) {
    logError('doGet error', error);
    return HtmlService.createHtmlOutput('<h1>Lỗi: ' + error.toString() + '</h1>');
  }
}

// ==================== INCLUDE HTML PARTIALS ====================

function include(filename) {
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (error) {
    logError('include error: ' + filename, error);
    return '<!-- Error loading ' + filename + ' -->';
  }
}

// ==================== API: LOGIN ====================

function handleLogin(username, password) {
  return login(username, password);
}

// ==================== API: LOGOUT ====================

function handleLogout() {
  return logout();
}

// ==================== API: GET CURRENT SESSION ====================

function handleGetSession() {
  var session = getCurrentSession();

  if (!session) {
    return createErrorResponse('Chưa đăng nhập');
  }

  return createSuccessResponse(session);
}

// ==================== API: LOAD ALL DATA ====================

function handleLoadAllData() {
  try {
    var session = getCurrentSession();

    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Load toàn bộ data
    var allData = loadAllData();

    // Nếu không phải admin, chỉ trả về data của user
    if (!isAdmin()) {
      allData = filterDataByUser(allData, session.userId);
    }

    return createSuccessResponse(allData, 'Load dữ liệu thành công');

  } catch (error) {
    return createErrorResponse('Lỗi load dữ liệu', error);
  }
}

// ==================== FILTER DATA BY USER ====================

function filterDataByUser(allData, userId) {
  var config = getConfig();

  // Filter các sheet theo UserID
  var userSheets = [
    config.SHEETS.INCOME,
    config.SHEETS.EXPENSE,
    config.SHEETS.INVESTMENT,
    config.SHEETS.LOAN,
    config.SHEETS.BUDGET,
    config.SHEETS.THIRD_PARTY,
    config.SHEETS.NOTIFICATIONS,
    config.SHEETS.AUDIT_LOG
  ];

  userSheets.forEach(function(sheetName) {
    if (allData[sheetName]) {
      allData[sheetName] = allData[sheetName].filter(function(row) {
        return row.UserID === userId || row.userId === userId;
      });
    }
  });

  // Settings và Accounts không filter (toàn bộ user cần thấy)

  return allData;
}

// ==================== API: CREATE RECORD ====================

function handleCreateRecord(sheetName, data) {
  try {
    var session = getCurrentSession();

    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Thêm UserID vào data
    data.UserID = data.UserID || session.userId;

    // Tạo ID mới
    var config = getConfig();
    var idColumn = 'ID';
    var prefix = 'ID';

    // Xác định prefix theo sheet
    switch (sheetName) {
      case config.SHEETS.INCOME:
        prefix = 'TN';
        break;
      case config.SHEETS.EXPENSE:
        prefix = 'CT';
        break;
      case config.SHEETS.INVESTMENT:
        prefix = 'DT';
        break;
      case config.SHEETS.LOAN:
        prefix = 'V';
        break;
      case config.SHEETS.BUDGET:
        prefix = 'NS';
        break;
      case config.SHEETS.THIRD_PARTY:
        prefix = 'TCH';
        break;
      case config.SHEETS.ACCOUNTS:
        prefix = 'ACC';
        idColumn = 'AccountID';
        break;
    }

    // Generate ID
    var lastId = getLastId(sheetName, idColumn);
    var newId = generateSequentialId(prefix, lastId);
    data[idColumn] = newId;

    // Append row
    appendRow(sheetName, data);

    // Log audit
    logAudit(session.userId, 'create', sheetName, newId, data);

    return createSuccessResponse({ id: newId }, 'Tạo mới thành công');

  } catch (error) {
    return createErrorResponse('Lỗi tạo mới', error);
  }
}

// ==================== API: UPDATE RECORD ====================

function handleUpdateRecord(sheetName, id, data) {
  try {
    var session = getCurrentSession();

    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Xác định idColumn
    var config = getConfig();
    var idColumn = sheetName === config.SHEETS.ACCOUNTS ? 'AccountID' : 'ID';

    // Kiểm tra quyền
    var record = findRecords(sheetName, {}); // Lấy tất cả để tìm
    var targetRecord = null;

    for (var i = 0; i < record.length; i++) {
      if (record[i][idColumn] === id) {
        targetRecord = record[i];
        break;
      }
    }

    if (!targetRecord) {
      return createErrorResponse('Không tìm thấy bản ghi');
    }

    // Kiểm tra quyền truy cập
    if (!isAdmin() && targetRecord.UserID !== session.userId) {
      return createErrorResponse('Không có quyền sửa bản ghi này');
    }

    // Update
    updateRow(sheetName, idColumn, id, data);

    // Log audit
    logAudit(session.userId, 'update', sheetName, id, data);

    return createSuccessResponse(null, 'Cập nhật thành công');

  } catch (error) {
    return createErrorResponse('Lỗi cập nhật', error);
  }
}

// ==================== API: DELETE RECORD ====================

function handleDeleteRecord(sheetName, id) {
  try {
    var session = getCurrentSession();

    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Xác định idColumn
    var config = getConfig();
    var idColumn = sheetName === config.SHEETS.ACCOUNTS ? 'AccountID' : 'ID';

    // Kiểm tra quyền
    var record = findRecords(sheetName, {});
    var targetRecord = null;

    for (var i = 0; i < record.length; i++) {
      if (record[i][idColumn] === id) {
        targetRecord = record[i];
        break;
      }
    }

    if (!targetRecord) {
      return createErrorResponse('Không tìm thấy bản ghi');
    }

    // Kiểm tra quyền truy cập
    if (!isAdmin() && targetRecord.UserID !== session.userId) {
      return createErrorResponse('Không có quyền xóa bản ghi này');
    }

    // Delete
    deleteRow(sheetName, idColumn, id);

    // Log audit
    logAudit(session.userId, 'delete', sheetName, id, null);

    return createSuccessResponse(null, 'Xóa thành công');

  } catch (error) {
    return createErrorResponse('Lỗi xóa', error);
  }
}

// ==================== API: CHANGE PASSWORD ====================

function handleChangePassword(oldPassword, newPassword) {
  return changePassword(oldPassword, newPassword);
}

// ==================== API: SAVE API KEYS (ADMIN ONLY) ====================

function handleSaveAPIKeys(geminiKey, telegramToken, telegramChatId) {
  try {
    if (!isAdmin()) {
      return createErrorResponse('Không có quyền');
    }

    saveAPIKeys(geminiKey, telegramToken, telegramChatId);

    return createSuccessResponse(null, 'Lưu API Keys thành công');

  } catch (error) {
    return createErrorResponse('Lỗi lưu API Keys', error);
  }
}

// ==================== API: GET API KEYS (ADMIN ONLY) ====================

function handleGetAPIKeys() {
  try {
    if (!isAdmin()) {
      return createErrorResponse('Không có quyền');
    }

    var keys = getAPIKeys();

    return createSuccessResponse(keys);

  } catch (error) {
    return createErrorResponse('Lỗi lấy API Keys', error);
  }
}
