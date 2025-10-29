/**
 * =====================================================
 * FILE: Auth.gs
 * MÔ TẢ: Xác thực và quản lý session người dùng
 * =====================================================
 */

// ==================== ĐĂNG NHẬP ====================

function login(username, password) {
  try {
    var config = getConfig();

    // Lấy danh sách users
    var users = getSheetData(config.SHEETS.USERS);

    // Tìm user theo username
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i]['Tên đăng nhập'] === username) {
        user = users[i];
        break;
      }
    }

    if (!user) {
      return createErrorResponse('Tên đăng nhập không tồn tại');
    }

    // Kiểm tra tình trạng
    if (user['Tình trạng'] !== 'Active') {
      return createErrorResponse('Tài khoản đã bị khóa');
    }

    // Verify password
    var storedPasswordHash = user['Mật khẩu'];
    var inputPasswordHash = hashPassword(password);

    if (storedPasswordHash !== inputPasswordHash) {
      return createErrorResponse('Mật khẩu không đúng');
    }

    // Parse metadata
    var metadata = safeJsonParse(user['userMetadata'], {});

    // Tạo session
    var sessionData = {
      userId: user['UserID'],
      username: username,
      fullName: user['Họ và tên'],
      email: user['Email'],
      role: user['Quyền'],
      loginTime: new Date().toISOString()
    };

    // Lưu session vào UserProperties
    setUserProperty('session', JSON.stringify(sessionData));

    // Update last login trong sheet
    metadata.lastLogin = new Date().toISOString();
    updateRow(config.SHEETS.USERS, 'UserID', user['UserID'], {
      'userMetadata': JSON.stringify(metadata)
    });

    // Log audit
    logAudit(user['UserID'], 'login', 'auth', null, {
      username: username,
      timestamp: sessionData.loginTime
    });

    return createSuccessResponse(sessionData, 'Đăng nhập thành công');

  } catch (error) {
    return createErrorResponse('Lỗi đăng nhập', error);
  }
}

// ==================== ĐĂNG XUẤT ====================

function logout() {
  try {
    var session = getCurrentSession();

    if (session) {
      // Log audit
      logAudit(session.userId, 'logout', 'auth', null, {
        username: session.username,
        timestamp: new Date().toISOString()
      });
    }

    // Xóa session
    clearUserProperties();

    return createSuccessResponse(null, 'Đăng xuất thành công');

  } catch (error) {
    return createErrorResponse('Lỗi đăng xuất', error);
  }
}

// ==================== LẤY SESSION HIỆN TẠI ====================

function getCurrentSession() {
  var sessionString = getUserProperty('session');

  if (!sessionString) return null;

  try {
    return JSON.parse(sessionString);
  } catch (e) {
    return null;
  }
}

// ==================== KIỂM TRA ĐĂNG NHẬP ====================

function isLoggedIn() {
  var session = getCurrentSession();
  return session !== null;
}

// ==================== KIỂM TRA QUYỀN ====================

function hasRole(role) {
  var session = getCurrentSession();

  if (!session) return false;

  return session.role === role;
}

function isAdmin() {
  var config = getConfig();
  return hasRole(config.ROLES.ADMIN);
}

// ==================== KIỂM TRA QUYỀN TRUY CẬP DATA ====================

function canAccessData(dataUserId) {
  var session = getCurrentSession();

  if (!session) return false;

  // Admin có thể truy cập mọi data
  if (isAdmin()) return true;

  // User chỉ được truy cập data của mình
  return session.userId === dataUserId;
}

// ==================== ĐỔI MẬT KHẨU ====================

function changePassword(oldPassword, newPassword) {
  try {
    var session = getCurrentSession();

    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();
    var users = getSheetData(config.SHEETS.USERS);

    // Tìm user
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i]['UserID'] === session.userId) {
        user = users[i];
        break;
      }
    }

    if (!user) {
      return createErrorResponse('Không tìm thấy user');
    }

    // Verify old password
    var storedPasswordHash = user['Mật khẩu'];
    var oldPasswordHash = hashPassword(oldPassword);

    if (storedPasswordHash !== oldPasswordHash) {
      return createErrorResponse('Mật khẩu cũ không đúng');
    }

    // Hash new password
    var newPasswordHash = hashPassword(newPassword);

    // Update password
    updateRow(config.SHEETS.USERS, 'UserID', session.userId, {
      'Mật khẩu': newPasswordHash
    });

    // Log audit
    logAudit(session.userId, 'change_password', 'auth', null, {
      timestamp: new Date().toISOString()
    });

    return createSuccessResponse(null, 'Đổi mật khẩu thành công');

  } catch (error) {
    return createErrorResponse('Lỗi đổi mật khẩu', error);
  }
}

// ==================== TẠO USER MỚI (ADMIN ONLY) ====================

function createUser(userData) {
  try {
    // Kiểm tra quyền admin
    if (!isAdmin()) {
      return createErrorResponse('Không có quyền thực hiện');
    }

    var config = getConfig();

    // Validate
    if (!userData.username || !userData.password) {
      return createErrorResponse('Username và password là bắt buộc');
    }

    if (!isValidEmail(userData.email)) {
      return createErrorResponse('Email không hợp lệ');
    }

    // Kiểm tra username đã tồn tại
    var existingUsers = findRecords(config.SHEETS.USERS, {
      'Tên đăng nhập': userData.username
    });

    if (existingUsers.length > 0) {
      return createErrorResponse('Username đã tồn tại');
    }

    // Tạo UserID
    var lastId = getLastId(config.SHEETS.USERS, 'UserID');
    var newUserId = generateSequentialId('USR', lastId);

    // Hash password
    var passwordHash = hashPassword(userData.password);

    // Tạo metadata
    var metadata = {
      phone: userData.phone || '',
      avatar: '',
      resetToken: null,
      resetTokenExpiry: null,
      loginAttempts: 0,
      lastLoginAttempt: null,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      createdBy: getCurrentSession().userId,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'vi'
      }
    };

    // Tạo row data
    var rowData = {
      'UserID': newUserId,
      'Tên đăng nhập': userData.username,
      'Mật khẩu': passwordHash,
      'Họ và tên': userData.fullName || '',
      'Email': userData.email,
      'Quyền': userData.role || config.ROLES.USER,
      'Tình trạng': 'Active',
      'userMetadata': JSON.stringify(metadata)
    };

    // Thêm vào sheet
    appendRow(config.SHEETS.USERS, rowData);

    // Log audit
    logAudit(getCurrentSession().userId, 'create', 'user', newUserId, {
      username: userData.username
    });

    return createSuccessResponse({ userId: newUserId }, 'Tạo user thành công');

  } catch (error) {
    return createErrorResponse('Lỗi tạo user', error);
  }
}

// ==================== LOG AUDIT ====================

function logAudit(userId, action, resource, resourceId, details) {
  try {
    var config = getConfig();

    // Tạo logId
    var lastId = getLastId(config.SHEETS.AUDIT_LOG, 'logId');
    var newLogId = generateSequentialId('LOG', lastId);

    // Lấy thông tin user
    var session = getCurrentSession();
    var userName = session ? session.fullName : 'System';

    // Tạo log data
    var logData = {
      'logId': newLogId,
      'Thời gian': new Date().toISOString(),
      'userId': userId,
      'action': action,
      'resource': resource,
      'resourceId': resourceId || '',
      'logDetails': JSON.stringify({
        action: action,
        resource: resource,
        resourceId: resourceId,
        userId: userId,
        userName: userName,
        ipAddress: '',
        userAgent: '',
        changes: details || {}
      })
    };

    // Append log
    appendRow(config.SHEETS.AUDIT_LOG, logData);

  } catch (error) {
    logError('Lỗi logAudit', error);
  }
}
