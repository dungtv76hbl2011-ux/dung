/**
 * =====================================================
 * FILE: Database.gs
 * MÔ TẢ: Thao tác với Google Sheets API v4
 * =====================================================
 */

// ==================== ĐỌC DỮ LIỆU TỪ NHIỀU SHEET (BATCH GET) ====================

function batchGetSheetData(sheetNames) {
  var spreadsheetId = getSpreadsheetId();

  try {
    // Tạo ranges
    var ranges = sheetNames.map(function(name) {
      return name + '!A:Z'; // Đọc từ cột A đến Z
    });

    // Sử dụng Sheets API v4
    var response = Sheets.Spreadsheets.Values.batchGet(spreadsheetId, {
      ranges: ranges,
      majorDimension: 'ROWS'
    });

    var result = {};

    // Parse data
    response.valueRanges.forEach(function(valueRange, index) {
      var sheetName = sheetNames[index];
      var values = valueRange.values || [];

      if (values.length > 0) {
        // Dòng đầu tiên là header
        var headers = values[0];
        var rows = values.slice(1);

        // Convert sang array of objects
        var data = rows.map(function(row) {
          var obj = {};
          headers.forEach(function(header, colIndex) {
            obj[header] = row[colIndex] || '';
          });
          return obj;
        });

        result[sheetName] = data;
      } else {
        result[sheetName] = [];
      }
    });

    return result;

  } catch (error) {
    logError('Lỗi batchGetSheetData', error);
    throw error;
  }
}

// ==================== ĐỌC TOÀN BỘ DỮ LIỆU ====================

function loadAllData() {
  var config = getConfig();

  var sheetNames = [
    config.SHEETS.INCOME,
    config.SHEETS.EXPENSE,
    config.SHEETS.INVESTMENT,
    config.SHEETS.LOAN,
    config.SHEETS.BUDGET,
    config.SHEETS.THIRD_PARTY,
    config.SHEETS.USERS,
    config.SHEETS.ACCOUNTS,
    config.SHEETS.SETTINGS,
    config.SHEETS.NOTIFICATIONS,
    config.SHEETS.AUDIT_LOG
  ];

  try {
    var data = batchGetSheetData(sheetNames);

    // Parse metadata fields (JSON columns)
    data[config.SHEETS.INCOME] = parseJsonFields(data[config.SHEETS.INCOME], ['Metadata', 'Danh mục thu nhập', 'Phương thức thanh toán']);
    data[config.SHEETS.EXPENSE] = parseJsonFields(data[config.SHEETS.EXPENSE], ['Metadata', 'Danh mục chi tiêu', 'Phương thức thanh toán']);
    data[config.SHEETS.INVESTMENT] = parseJsonFields(data[config.SHEETS.INVESTMENT], ['Chi tiết đầu tư']);
    data[config.SHEETS.LOAN] = parseJsonFields(data[config.SHEETS.LOAN], ['Chi tiết khoản vay']);
    data[config.SHEETS.BUDGET] = parseJsonFields(data[config.SHEETS.BUDGET], ['Metadata', 'Danh mục ID']);
    data[config.SHEETS.THIRD_PARTY] = parseJsonFields(data[config.SHEETS.THIRD_PARTY], ['Chi tiết']);
    data[config.SHEETS.USERS] = parseJsonFields(data[config.SHEETS.USERS], ['userMetadata']);
    data[config.SHEETS.ACCOUNTS] = parseJsonFields(data[config.SHEETS.ACCOUNTS], ['Metadata']);
    data[config.SHEETS.AI_CHAT] = parseJsonFields(data[config.SHEETS.AI_CHAT], ['chatData']);
    data[config.SHEETS.NOTIFICATIONS] = parseJsonFields(data[config.SHEETS.NOTIFICATIONS], ['notificationData']);
    data[config.SHEETS.AUDIT_LOG] = parseJsonFields(data[config.SHEETS.AUDIT_LOG], ['logDetails']);

    return data;

  } catch (error) {
    logError('Lỗi loadAllData', error);
    throw error;
  }
}

// ==================== PARSE JSON FIELDS ====================

function parseJsonFields(dataArray, jsonFieldNames) {
  if (!dataArray || !Array.isArray(dataArray)) return dataArray;

  return dataArray.map(function(row) {
    jsonFieldNames.forEach(function(fieldName) {
      if (row[fieldName]) {
        row[fieldName] = safeJsonParse(row[fieldName], {});
      }
    });
    return row;
  });
}

// ==================== ĐỌC DỮ LIỆU MỘT SHEET ====================

function getSheetData(sheetName) {
  var sheet = getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  if (data.length === 0) return [];

  var headers = data[0];
  var rows = data.slice(1);

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(header, index) {
      obj[header] = row[index];
    });
    return obj;
  });
}

// ==================== THÊM HÀNG MỚI ====================

function appendRow(sheetName, rowData) {
  var sheet = getSheetByName(sheetName);

  // Lấy headers
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Tạo row array theo thứ tự headers
  var rowArray = headers.map(function(header) {
    var value = rowData[header];

    // Nếu là object/array, convert sang JSON
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return value !== undefined ? value : '';
  });

  // Append row
  sheet.appendRow(rowArray);

  return createSuccessResponse(null, 'Thêm dữ liệu thành công');
}

// ==================== CẬP NHẬT HÀNG ====================

function updateRow(sheetName, idColumn, id, rowData) {
  var sheet = getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  if (data.length === 0) {
    throw new Error('Sheet rỗng');
  }

  var headers = data[0];
  var idIndex = headers.indexOf(idColumn);

  if (idIndex === -1) {
    throw new Error('Không tìm thấy cột: ' + idColumn);
  }

  // Tìm row cần update
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error('Không tìm thấy bản ghi với ' + idColumn + ' = ' + id);
  }

  // Update từng cell
  headers.forEach(function(header, colIndex) {
    if (rowData.hasOwnProperty(header)) {
      var value = rowData[header];

      // Convert object/array sang JSON
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value);
      }

      sheet.getRange(rowIndex + 1, colIndex + 1).setValue(value);
    }
  });

  return createSuccessResponse(null, 'Cập nhật thành công');
}

// ==================== XÓA HÀNG ====================

function deleteRow(sheetName, idColumn, id) {
  var sheet = getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  if (data.length === 0) {
    throw new Error('Sheet rỗng');
  }

  var headers = data[0];
  var idIndex = headers.indexOf(idColumn);

  if (idIndex === -1) {
    throw new Error('Không tìm thấy cột: ' + idColumn);
  }

  // Tìm row cần xóa
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    throw new Error('Không tìm thấy bản ghi');
  }

  // Xóa row (row index bắt đầu từ 1)
  sheet.deleteRow(rowIndex + 1);

  return createSuccessResponse(null, 'Xóa thành công');
}

// ==================== BATCH UPDATE ====================

function batchUpdateRows(sheetName, updates) {
  // updates là array of {id, data}
  var results = [];

  updates.forEach(function(update) {
    try {
      updateRow(sheetName, 'ID', update.id, update.data);
      results.push({ id: update.id, success: true });
    } catch (error) {
      results.push({ id: update.id, success: false, error: error.toString() });
    }
  });

  return results;
}

// ==================== TÌM KIẾM ====================

function findRecords(sheetName, criteria) {
  var data = getSheetData(sheetName);

  // Filter theo criteria
  var filtered = data.filter(function(row) {
    var match = true;

    Object.keys(criteria).forEach(function(key) {
      if (row[key] !== criteria[key]) {
        match = false;
      }
    });

    return match;
  });

  return filtered;
}

// ==================== ĐẾM SỐ LƯỢNG ====================

function countRecords(sheetName, criteria) {
  var records = findRecords(sheetName, criteria);
  return records.length;
}

// ==================== LẤY LAST ID ====================

function getLastId(sheetName, idColumn) {
  var sheet = getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) return null; // Chỉ có header hoặc rỗng

  var headers = data[0];
  var idIndex = headers.indexOf(idColumn);

  if (idIndex === -1) return null;

  // Lấy ID của row cuối cùng
  var lastRow = data[data.length - 1];
  return lastRow[idIndex];
}
