/**
 * =====================================================
 * FILE: Utils.gs
 * MÔ TẢ: Các hàm tiện ích chung
 * =====================================================
 */

// ==================== FORMAT SỐ TIỀN ====================

function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return '0₫';
  }

  var number = parseFloat(amount);
  if (isNaN(number)) {
    return '0₫';
  }

  // Format với dấu phân cách hàng nghìn
  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Parse số tiền từ string (loại bỏ dấu phân cách)
function parseCurrency(currencyString) {
  if (!currencyString) return 0;

  // Loại bỏ tất cả ký tự không phải số (trừ dấu trừ và dấu chấm thập phân)
  var cleaned = currencyString.toString().replace(/[^\d.-]/g, '');
  var number = parseFloat(cleaned);

  return isNaN(number) ? 0 : number;
}

// ==================== FORMAT NGÀY THÁNG ====================

function formatDate(date, format) {
  if (!date) return '';

  // Chuyển đổi sang Date object nếu cần
  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date)) {
    return '';
  }

  format = format || 'dd/MM/yyyy';

  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var seconds = ('0' + date.getSeconds()).slice(-2);

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// Parse ngày từ string dd/MM/yyyy
function parseDate(dateString) {
  if (!dateString) return null;

  var parts = dateString.split('/');
  if (parts.length === 3) {
    // dd/MM/yyyy
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    var year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  // Thử parse với Date.parse
  var date = new Date(dateString);
  return isNaN(date) ? null : date;
}

// Lấy tháng hiện tại format yyyy-MM
function getCurrentMonth() {
  var now = new Date();
  var year = now.getFullYear();
  var month = ('0' + (now.getMonth() + 1)).slice(-2);
  return year + '-' + month;
}

// ==================== TẠO ID ====================

function generateId(prefix) {
  prefix = prefix || 'ID';

  // Tạo ID dạng: PREFIX + timestamp + random
  var timestamp = new Date().getTime();
  var random = Math.floor(Math.random() * 1000);

  return prefix + timestamp + '_' + random;
}

// Tạo ID theo format cụ thể (ví dụ: TN00001)
function generateSequentialId(prefix, lastId) {
  prefix = prefix || 'ID';

  if (!lastId) {
    return prefix + '00001';
  }

  // Lấy số từ lastId
  var numberPart = lastId.replace(prefix, '');
  var nextNumber = parseInt(numberPart, 10) + 1;

  // Pad với số 0
  var paddedNumber = ('00000' + nextNumber).slice(-5);

  return prefix + paddedNumber;
}

// ==================== VALIDATE ====================

function isValidEmail(email) {
  if (!email) return false;

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  if (!phone) return false;

  // Vietnam phone: 10-11 số, bắt đầu bằng 0
  var phoneRegex = /^0\d{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// ==================== HASH PASSWORD ====================

function hashPassword(password) {
  if (!password) return '';

  // Sử dụng SHA-256
  var rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );

  // Convert to hex string
  var hash = '';
  for (var i = 0; i < rawHash.length; i++) {
    var byte = rawHash[i];
    if (byte < 0) byte += 256;
    var hex = byte.toString(16);
    if (hex.length === 1) hex = '0' + hex;
    hash += hex;
  }

  return hash;
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// ==================== JSON HELPERS ====================

function safeJsonParse(jsonString, defaultValue) {
  defaultValue = defaultValue || null;

  if (!jsonString) return defaultValue;

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logError('JSON parse error', e);
    return defaultValue;
  }
}

function safeJsonStringify(obj, defaultValue) {
  defaultValue = defaultValue || '{}';

  if (!obj) return defaultValue;

  try {
    return JSON.stringify(obj);
  } catch (e) {
    logError('JSON stringify error', e);
    return defaultValue;
  }
}

// ==================== ARRAY HELPERS ====================

function findById(array, id) {
  if (!array || !Array.isArray(array)) return null;

  for (var i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i];
    }
  }

  return null;
}

function removeById(array, id) {
  if (!array || !Array.isArray(array)) return array;

  return array.filter(function(item) {
    return item.id !== id;
  });
}

// ==================== STRING HELPERS ====================

function truncate(str, maxLength) {
  if (!str || str.length <= maxLength) return str;

  return str.substring(0, maxLength) + '...';
}

function capitalize(str) {
  if (!str) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==================== RESPONSE HELPERS ====================

function createSuccessResponse(data, message) {
  return {
    success: true,
    message: message || 'Thành công',
    data: data || null,
    timestamp: new Date().toISOString()
  };
}

function createErrorResponse(message, error) {
  logError(message, error);

  return {
    success: false,
    message: message || 'Có lỗi xảy ra',
    error: error ? error.toString() : null,
    timestamp: new Date().toISOString()
  };
}

// ==================== PERCENTAGE ====================

function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;

  return ((value / total) * 100).toFixed(2);
}

// ==================== SLEEP ====================

function sleep(milliseconds) {
  Utilities.sleep(milliseconds);
}

// ==================== CLONE OBJECT ====================

function cloneObject(obj) {
  if (!obj) return null;

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
}

// ==================== SANITIZE HTML ====================

function sanitizeHtml(str) {
  if (!str) return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
