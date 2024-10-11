export function checkString(str) {
  // Kiểm tra xem chuỗi có chứa mẫu " (" hay không
  if (str.includes(" (")) {
    return true;
  } else {
    return false;
  }
}
