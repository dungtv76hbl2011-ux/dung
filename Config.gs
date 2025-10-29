/**
 * =====================================================
 * FILE: Config.gs
 * MÔ TẢ: Cấu hình toàn bộ hệ thống
 * =====================================================
 */

// ==================== CẤU HÌNH CƠ BẢN ====================

function getConfig() {
  return {
    // Tên ứng dụng
    APP_NAME: 'Quản Lý Chi Tiêu Cá Nhân',
    APP_VERSION: '1.0.0',

    // Màu sắc chủ đạo
    COLORS: {
      PRIMARY: '#f99d07',    // Cam
      DANGER: '#e94849',     // Đỏ
      INFO: '#3782f4',       // Xanh dương
      SUCCESS: '#24c560',    // Xanh lá
      WARNING: '#ffc107',    // Vàng
      DARK: '#2c3e50',       // Tối
      LIGHT: '#ecf0f1',      // Sáng
      WHITE: '#ffffff',
      GRAY: '#95a5a6'
    },

    // Cấu hình phân quyền
    ROLES: {
      ADMIN: 'Admin',
      USER: 'User'
    },

    // Tên các sheet
    SHEETS: {
      INCOME: 'Thu nhập',
      EXPENSE: 'Chi tiêu',
      INVESTMENT: 'Đầu tư',
      LOAN: 'Khoản vay',
      BUDGET: 'Ngân sách',
      THIRD_PARTY: 'Thu chi hộ',
      USERS: 'Người dùng',
      ACCOUNTS: 'Tài khoản',
      AI_CHAT: 'Ai_chat_history',
      NOTIFICATIONS: 'NOTIFICATIONS',
      AUDIT_LOG: 'AUDIT_LOG',
      SETTINGS: 'Cài đặt'
    },

    // Cấu hình pagination
    PAGINATION: {
      ROWS_PER_PAGE: 20,
      ROWS_OPTIONS: [10, 20, 50, 100]
    },

    // Format số tiền
    CURRENCY: {
      SYMBOL: '₫',
      LOCALE: 'vi-VN',
      DECIMAL_PLACES: 0
    },

    // Session timeout (phút)
    SESSION_TIMEOUT: 120,

    // Cấu hình API (để trống, sẽ điền sau)
    API_KEYS: {
      GEMINI: '',  // Sẽ lưu trong Script Properties
      TELEGRAM_BOT_TOKEN: '',  // Sẽ lưu trong Script Properties
      TELEGRAM_CHAT_ID: ''  // Sẽ lưu trong Script Properties
    }
  };
}

// ==================== LẤY SPREADSHEET ====================

function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSpreadsheetId() {
  return getSpreadsheet().getId();
}

// ==================== LẤY SHEET THEO TÊN ====================

function getSheetByName(sheetName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Không tìm thấy sheet: ' + sheetName);
  }

  return sheet;
}

// ==================== SCRIPT PROPERTIES ====================

function setScriptProperty(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function getScriptProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function deleteScriptProperty(key) {
  PropertiesService.getScriptProperties().deleteProperty(key);
}

// Lưu API Keys
function saveAPIKeys(geminiKey, telegramToken, telegramChatId) {
  if (geminiKey) setScriptProperty('GEMINI_API_KEY', geminiKey);
  if (telegramToken) setScriptProperty('TELEGRAM_BOT_TOKEN', telegramToken);
  if (telegramChatId) setScriptProperty('TELEGRAM_CHAT_ID', telegramChatId);
}

// Lấy API Keys
function getAPIKeys() {
  return {
    gemini: getScriptProperty('GEMINI_API_KEY') || '',
    telegramToken: getScriptProperty('TELEGRAM_BOT_TOKEN') || '',
    telegramChatId: getScriptProperty('TELEGRAM_CHAT_ID') || ''
  };
}

// ==================== USER PROPERTIES (SESSION) ====================

function setUserProperty(key, value) {
  PropertiesService.getUserProperties().setProperty(key, value);
}

function getUserProperty(key) {
  return PropertiesService.getUserProperties().getProperty(key);
}

function deleteUserProperty(key) {
  PropertiesService.getUserProperties().deleteProperty(key);
}

function clearUserProperties() {
  PropertiesService.getUserProperties().deleteAllProperties();
}

// ==================== CACHE SERVICE ====================

function setCache(key, value, expiration) {
  // expiration in seconds (default: 6 hours = 21600s)
  expiration = expiration || 21600;
  var cache = CacheService.getScriptCache();
  cache.put(key, JSON.stringify(value), expiration);
}

function getCache(key) {
  var cache = CacheService.getScriptCache();
  var cached = cache.get(key);
  return cached ? JSON.parse(cached) : null;
}

function removeCache(key) {
  var cache = CacheService.getScriptCache();
  cache.remove(key);
}

function clearAllCache() {
  var cache = CacheService.getScriptCache();
  cache.removeAll(['allData', 'categories']);
}

// ==================== LOGGING ====================

function logInfo(message, data) {
  console.info('[INFO] ' + message, data || '');
}

function logError(message, error) {
  console.error('[ERROR] ' + message, error || '');
}

function logWarning(message, data) {
  console.warn('[WARNING] ' + message, data || '');
}
