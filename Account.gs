/**
 * =====================================================
 * FILE: Account.gs
 * MÔ TẢ: Backend CRUD và quản lý tài khoản
 * =====================================================
 */

// ==================== LẤY TẤT CẢ TÀI KHOẢN ====================

function handleGetAllAccounts() {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();
    var accounts = getSheetData(config.SHEETS.ACCOUNTS);

    // Parse metadata
    accounts = accounts.map(function(account) {
      if (account['Metadata']) {
        account['Metadata'] = safeJsonParse(account['Metadata'], {});
      }
      return account;
    });

    // Tính tổng số dư
    var totalBalance = accounts.reduce(function(sum, acc) {
      return sum + parseFloat(acc['Số dư hiện tại'] || 0);
    }, 0);

    return createSuccessResponse({
      accounts: accounts,
      totalBalance: totalBalance,
      count: accounts.length
    }, 'Lấy danh sách tài khoản thành công');

  } catch (error) {
    return createErrorResponse('Lỗi lấy danh sách tài khoản', error);
  }
}

// ==================== LẤY CHI TIẾT TÀI KHOẢN ====================

function handleGetAccountById(accountId) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();
    var accounts = findRecords(config.SHEETS.ACCOUNTS, {
      'AccountID': accountId
    });

    if (accounts.length === 0) {
      return createErrorResponse('Không tìm thấy tài khoản');
    }

    var account = accounts[0];

    // Parse metadata
    if (account['Metadata']) {
      account['Metadata'] = safeJsonParse(account['Metadata'], {});
    }

    return createSuccessResponse(account, 'Lấy thông tin tài khoản thành công');

  } catch (error) {
    return createErrorResponse('Lỗi lấy thông tin tài khoản', error);
  }
}

// ==================== TẠO TÀI KHOẢN MỚI ====================

function handleCreateAccount(accountData) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Validate
    if (!accountData.accountType || !accountData.accountName) {
      return createErrorResponse('Vui lòng nhập đầy đủ thông tin');
    }

    // Validate số dư >= 0
    var initialBalance = parseFloat(accountData.initialBalance || 0);
    if (initialBalance < 0) {
      return createErrorResponse('Số dư đầu kỳ không được âm');
    }

    var config = getConfig();

    // Generate AccountID
    var lastId = getLastId(config.SHEETS.ACCOUNTS, 'AccountID');
    var newAccountId = generateSequentialId('ACC', lastId);

    // Tạo metadata
    var metadata = {
      accountNumber: accountData.accountNumber || '',
      bankCode: accountData.bankCode || '',
      branch: accountData.branch || '',
      ownerName: session.fullName,
      notes: accountData.notes || '',
      createdAt: new Date().toISOString(),
      createdBy: session.userId
    };

    // Tạo row data
    var rowData = {
      'AccountID': newAccountId,
      'Loại': accountData.accountType,
      'Tên tài khoản': accountData.accountName,
      'Số dư đầu kỳ': initialBalance,
      'Số dư hiện tại': initialBalance,
      'Metadata': JSON.stringify(metadata)
    };

    // Thêm vào sheet
    appendRow(config.SHEETS.ACCOUNTS, rowData);

    // Log audit
    logAudit(session.userId, 'create', 'account', newAccountId, {
      accountName: accountData.accountName,
      accountType: accountData.accountType,
      initialBalance: initialBalance
    });

    return createSuccessResponse({
      accountId: newAccountId,
      account: rowData
    }, 'Tạo tài khoản thành công');

  } catch (error) {
    return createErrorResponse('Lỗi tạo tài khoản', error);
  }
}

// ==================== CẬP NHẬT TÀI KHOẢN ====================

function handleUpdateAccount(accountId, accountData) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();

    // Kiểm tra tài khoản tồn tại
    var accounts = findRecords(config.SHEETS.ACCOUNTS, {
      'AccountID': accountId
    });

    if (accounts.length === 0) {
      return createErrorResponse('Không tìm thấy tài khoản');
    }

    var currentAccount = accounts[0];
    var currentMetadata = safeJsonParse(currentAccount['Metadata'], {});

    // Validate
    if (accountData.accountName) {
      currentAccount['Tên tài khoản'] = accountData.accountName;
    }

    if (accountData.accountType) {
      currentAccount['Loại'] = accountData.accountType;
    }

    // Update metadata
    if (accountData.accountNumber !== undefined) {
      currentMetadata.accountNumber = accountData.accountNumber;
    }
    if (accountData.bankCode !== undefined) {
      currentMetadata.bankCode = accountData.bankCode;
    }
    if (accountData.branch !== undefined) {
      currentMetadata.branch = accountData.branch;
    }
    if (accountData.notes !== undefined) {
      currentMetadata.notes = accountData.notes;
    }

    currentMetadata.updatedAt = new Date().toISOString();
    currentMetadata.updatedBy = session.userId;

    // Cập nhật
    var updateData = {
      'Tên tài khoản': currentAccount['Tên tài khoản'],
      'Loại': currentAccount['Loại'],
      'Metadata': JSON.stringify(currentMetadata)
    };

    updateRow(config.SHEETS.ACCOUNTS, 'AccountID', accountId, updateData);

    // Log audit
    logAudit(session.userId, 'update', 'account', accountId, accountData);

    return createSuccessResponse(null, 'Cập nhật tài khoản thành công');

  } catch (error) {
    return createErrorResponse('Lỗi cập nhật tài khoản', error);
  }
}

// ==================== XÓA TÀI KHOẢN ====================

function handleDeleteAccount(accountId) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();

    // Kiểm tra tài khoản tồn tại
    var accounts = findRecords(config.SHEETS.ACCOUNTS, {
      'AccountID': accountId
    });

    if (accounts.length === 0) {
      return createErrorResponse('Không tìm thấy tài khoản');
    }

    // Kiểm tra có giao dịch liên quan không
    var hasTransactions = checkAccountHasTransactions(accountId);

    if (hasTransactions) {
      return createErrorResponse('Không thể xóa tài khoản đã có giao dịch. Vui lòng chuyển số dư về 0 và không còn giao dịch liên quan.');
    }

    // Xóa
    deleteRow(config.SHEETS.ACCOUNTS, 'AccountID', accountId);

    // Log audit
    logAudit(session.userId, 'delete', 'account', accountId, {
      accountName: accounts[0]['Tên tài khoản']
    });

    return createSuccessResponse(null, 'Xóa tài khoản thành công');

  } catch (error) {
    return createErrorResponse('Lỗi xóa tài khoản', error);
  }
}

// ==================== KIỂM TRA TÀI KHOẢN CÓ GIAO DỊCH ====================

function checkAccountHasTransactions(accountId) {
  var config = getConfig();

  // Kiểm tra trong Thu nhập
  var income = getSheetData(config.SHEETS.INCOME);
  for (var i = 0; i < income.length; i++) {
    var paymentMethod = safeJsonParse(income[i]['Phương thức thanh toán'], []);
    if (Array.isArray(paymentMethod)) {
      for (var j = 0; j < paymentMethod.length; j++) {
        if (paymentMethod[j].id === accountId) {
          return true;
        }
      }
    }
  }

  // Kiểm tra trong Chi tiêu
  var expense = getSheetData(config.SHEETS.EXPENSE);
  for (var i = 0; i < expense.length; i++) {
    var paymentMethod = safeJsonParse(expense[i]['Phương thức thanh toán'], []);
    if (Array.isArray(paymentMethod)) {
      for (var j = 0; j < paymentMethod.length; j++) {
        if (paymentMethod[j].id === accountId) {
          return true;
        }
      }
    }
  }

  return false;
}

// ==================== CẬP NHẬT SỐ DƯ TÀI KHOẢN ====================

function updateAccountBalance(accountId, amount, isIncrease) {
  var config = getConfig();

  // Lấy thông tin tài khoản
  var accounts = findRecords(config.SHEETS.ACCOUNTS, {
    'AccountID': accountId
  });

  if (accounts.length === 0) {
    throw new Error('Không tìm thấy tài khoản: ' + accountId);
  }

  var account = accounts[0];
  var currentBalance = parseFloat(account['Số dư hiện tại'] || 0);
  var newBalance;

  if (isIncrease) {
    newBalance = currentBalance + amount;
  } else {
    newBalance = currentBalance - amount;
  }

  // Kiểm tra số dư không âm
  if (newBalance < 0) {
    throw new Error('Số dư tài khoản không đủ. Số dư hiện tại: ' + formatCurrency(currentBalance));
  }

  // Cập nhật số dư
  updateRow(config.SHEETS.ACCOUNTS, 'AccountID', accountId, {
    'Số dư hiện tại': newBalance
  });

  return newBalance;
}

// ==================== KIỂM TRA SỐ DƯ TÀI KHOẢN ====================

function validateAccountBalance(accountId, amount) {
  var config = getConfig();

  var accounts = findRecords(config.SHEETS.ACCOUNTS, {
    'AccountID': accountId
  });

  if (accounts.length === 0) {
    return {
      valid: false,
      message: 'Không tìm thấy tài khoản'
    };
  }

  var currentBalance = parseFloat(accounts[0]['Số dư hiện tại'] || 0);

  if (currentBalance < amount) {
    return {
      valid: false,
      message: 'Số dư không đủ. Số dư hiện tại: ' + formatCurrency(currentBalance) + ', cần: ' + formatCurrency(amount),
      currentBalance: currentBalance,
      required: amount
    };
  }

  return {
    valid: true,
    message: 'Số dư đủ',
    currentBalance: currentBalance,
    remaining: currentBalance - amount
  };
}

// ==================== LẤY SỐ DƯ TÀI KHOẢN ====================

function getAccountBalance(accountId) {
  var config = getConfig();

  var accounts = findRecords(config.SHEETS.ACCOUNTS, {
    'AccountID': accountId
  });

  if (accounts.length === 0) {
    return 0;
  }

  return parseFloat(accounts[0]['Số dư hiện tại'] || 0);
}
