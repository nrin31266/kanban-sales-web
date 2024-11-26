// Hàm chuyển đổi ngày string thành định dạng ngày tháng năm
export const formatDateDMY = (dateString: string): string => {
    const date = new Date(dateString);
  
    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(date.getTime())) {
      return '?'; // Trả về chuỗi rỗng nếu ngày không hợp lệ
    }
  
    // Lấy ngày, tháng, năm từ đối tượng Date
    const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 phía trước nếu ngày là số có 1 chữ số
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cộng 1
    const year = date.getFullYear();
  
    // Trả về ngày theo định dạng: dd/mm/yyyy
    return `${day}/${month}/${year}`;
  };