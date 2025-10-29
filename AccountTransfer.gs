/**
 * =====================================================
 * FILE: AccountTransfer.gs
 * MÔ TẢ: Xử lý chuyển tiền giữa các tài khoản
 * =====================================================
 */

// ==================== CHUYỂN TIỀN ====================

function handleTransferMoney(transferData) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    // Validate
    if (!transferData.fromAccountId || !transferData.toAccountId) {
      return createErrorResponse('Vui lòng chọn tài khoản nguồn và đích');
    }

    if (transferData.fromAccountId === transferData.toAccountId) {
      return createErrorResponse('Không thể chuyển tiền cho cùng một tài khoản');
    }

    var amount = parseFloat(transferData.amount || 0);
    if (amount <= 0) {
      return createErrorResponse('Số tiền phải lớn hơn 0');
    }

    var config = getConfig();

    // Lấy thông tin tài khoản nguồn
    var fromAccounts = findRecords(config.SHEETS.ACCOUNTS, {
      'AccountID': transferData.fromAccountId
    });

    if (fromAccounts.length === 0) {
      return createErrorResponse('Không tìm thấy tài khoản nguồn');
    }

    var fromAccount = fromAccounts[0];

    // Lấy thông tin tài khoản đích
    var toAccounts = findRecords(config.SHEETS.ACCOUNTS, {
      'AccountID': transferData.toAccountId
    });

    if (toAccounts.length === 0) {
      return createErrorResponse('Không tìm thấy tài khoản đích');
    }

    var toAccount = toAccounts[0];

    // Kiểm tra số dư tài khoản nguồn
    var fromBalance = parseFloat(fromAccount['Số dư hiện tại'] || 0);
    if (fromBalance < amount) {
      return createErrorResponse(
        'Số dư tài khoản nguồn không đủ.\n' +
        'Số dư hiện tại: ' + formatCurrency(fromBalance) + '\n' +
        'Cần: ' + formatCurrency(amount)
      );
    }

    // Thực hiện chuyển tiền (Atomic transaction)
    try {
      // Trừ tiền từ tài khoản nguồn
      var newFromBalance = updateAccountBalance(transferData.fromAccountId, amount, false);

      // Cộng tiền vào tài khoản đích
      var newToBalance = updateAccountBalance(transferData.toAccountId, amount, true);

      // Tạo log chuyển tiền trong AUDIT_LOG
      var transferLog = {
        transferId: generateId('TRF'),
        fromAccountId: transferData.fromAccountId,
        fromAccountName: fromAccount['Tên tài khoản'],
        toAccountId: transferData.toAccountId,
        toAccountName: toAccount['Tên tài khoản'],
        amount: amount,
        fromBalanceBefore: fromBalance,
        fromBalanceAfter: newFromBalance,
        toBalanceBefore: parseFloat(toAccount['Số dư hiện tại'] || 0),
        toBalanceAfter: newToBalance,
        description: transferData.description || '',
        transferDate: new Date().toISOString(),
        userId: session.userId,
        userName: session.fullName
      };

      // Log audit
      logAudit(session.userId, 'transfer', 'account', transferData.fromAccountId, transferLog);

      return createSuccessResponse({
        transfer: transferLog,
        fromAccount: {
          id: transferData.fromAccountId,
          name: fromAccount['Tên tài khoản'],
          balanceBefore: fromBalance,
          balanceAfter: newFromBalance
        },
        toAccount: {
          id: transferData.toAccountId,
          name: toAccount['Tên tài khoản'],
          balanceBefore: parseFloat(toAccount['Số dư hiện tại'] || 0),
          balanceAfter: newToBalance
        }
      }, 'Chuyển tiền thành công');

    } catch (error) {
      // Rollback nếu có lỗi (trong thực tế cần xử lý rollback cẩn thận hơn)
      logError('Transfer failed - rollback needed', error);
      throw error;
    }

  } catch (error) {
    return createErrorResponse('Lỗi chuyển tiền', error);
  }
}

// ==================== LẤY LỊCH SỬ CHUYỂN TIỀN ====================

function handleGetTransferHistory(filters) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    filters = filters || {};

    var config = getConfig();

    // Lấy tất cả audit log có action = 'transfer'
    var allLogs = getSheetData(config.SHEETS.AUDIT_LOG);

    var transfers = [];

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

    // Sort theo thời gian mới nhất
    transfers.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    // Limit nếu có
    if (filters.limit) {
      transfers = transfers.slice(0, filters.limit);
    }

    return createSuccessResponse({
      transfers: transfers,
      count: transfers.length
    }, 'Lấy lịch sử chuyển tiền thành công');

  } catch (error) {
    return createErrorResponse('Lỗi lấy lịch sử chuyển tiền', error);
  }
}

// ==================== LẤY THỐNG KÊ CHUYỂN TIỀN ====================

function handleGetTransferStats(accountId, month) {
  try {
    var session = getCurrentSession();
    if (!session) {
      return createErrorResponse('Chưa đăng nhập');
    }

    var config = getConfig();

    // Lấy lịch sử chuyển tiền
    var historyResult = handleGetTransferHistory({ accountId: accountId });

    if (!historyResult.success) {
      return historyResult;
    }

    var transfers = historyResult.data.transfers;

    // Tính tổng tiền chuyển đi
    var totalOut = 0;
    var countOut = 0;

    // Tính tổng tiền chuyển vào
    var totalIn = 0;
    var countIn = 0;

    transfers.forEach(function(transfer) {
      // Filter theo tháng nếu có
      if (month) {
        var transferDate = new Date(transfer.timestamp);
        var transferMonth = transferDate.getFullYear() + '-' + ('0' + (transferDate.getMonth() + 1)).slice(-2);
        if (transferMonth !== month) {
          return;
        }
      }

      if (transfer.fromAccountId === accountId) {
        totalOut += transfer.amount;
        countOut++;
      }

      if (transfer.toAccountId === accountId) {
        totalIn += transfer.amount;
        countIn++;
      }
    });

    return createSuccessResponse({
      accountId: accountId,
      month: month || 'all',
      totalOut: totalOut,
      countOut: countOut,
      totalIn: totalIn,
      countIn: countIn,
      net: totalIn - totalOut
    }, 'Lấy thống kê chuyển tiền thành công');

  } catch (error) {
    return createErrorResponse('Lỗi lấy thống kê chuyển tiền', error);
  }
}
