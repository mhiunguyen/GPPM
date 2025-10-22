import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      "app.title": "DermaSafe-AI",
      "app.subtitle": "Công cụ Sàng lọc Rủi ro Da liễu dựa trên AI",
      "imageUploader.label": "Tải ảnh da lên:",
      "imageUploader.placeholder": "Kéo thả ảnh vào đây hoặc nhấp để chọn",
      "imageUploader.support": "Hỗ trợ: JPG, PNG, GIF",
      "symptomSelector.label": "Chọn các triệu chứng:",
      "symptomSelector.duration": "Thời gian xuất hiện:",
      "analyze.button": "Phân tích",
      "analyze.loading": "Đang phân tích...",
      "error.banner": "Lỗi:",
      "result.title": "Kết quả phân tích",
      "result.reminder": "Đây chỉ là sàng lọc rủi ro ban đầu. Hãy tham vấn bác sĩ da liễu để có chẩn đoán chính xác.",
      "footer.disclaimer": "Đây KHÔNG phải là công cụ chẩn đoán y tế. Kết quả chỉ mang tính chất tham khảo.",
      "footer.copyright": "DermaSafe-AI © 2025",
      "footer.github": "GitHub",
      "modal.title": "Cảnh báo Y tế Quan trọng",
      "modal.text1": "DermaSafe-AI KHÔNG PHẢI LÀ BÁC SĨ.",
      "modal.text2": "Đây KHÔNG phải là công cụ chẩn đoán y tế. Mục tiêu duy nhất của ứng dụng này là SÀNG LỌC RỦI RO — giúp bạn đưa ra quyết định có nên đi khám bác sĩ hay không dựa trên các dấu hiệu phổ biến.",
      "modal.text3": "Kết quả của AI không bao giờ thay thế ý kiến, chẩn đoán, hoặc điều trị của một chuyên gia y tế đã qua đào tạo.",
      "modal.text4": "Luôn luôn tham vấn bác sĩ da liễu để có chẩn đoán chính xác.",
      "modal.checkbox": "Tôi hiểu đây không phải là chẩn đoán y tế và chỉ là công cụ sàng lọc rủi ro.",
      "modal.button": "Đồng ý và Tiếp tục"
    }
  },
  en: {
    translation: {
      "app.title": "DermaSafe-AI",
      "app.subtitle": "AI-powered Dermatology Risk Screening Tool",
      "imageUploader.label": "Upload skin image:",
      "imageUploader.placeholder": "Drag & drop or click to select image",
      "imageUploader.support": "Supported: JPG, PNG, GIF",
      "symptomSelector.label": "Select symptoms:",
      "symptomSelector.duration": "Duration:",
      "analyze.button": "Analyze",
      "analyze.loading": "Analyzing...",
      "error.banner": "Error:",
      "result.title": "Analysis Result",
      "result.reminder": "This is only an initial risk screening. Always consult a dermatologist for an accurate diagnosis.",
      "footer.disclaimer": "This is NOT a medical diagnostic tool. Results are for reference only.",
      "footer.copyright": "DermaSafe-AI © 2025",
      "footer.github": "GitHub",
      "modal.title": "Important Medical Warning",
      "modal.text1": "DermaSafe-AI is NOT a doctor.",
      "modal.text2": "This is NOT a medical diagnostic tool. The sole purpose of this app is RISK SCREENING — helping you decide whether to see a doctor based on common signs.",
      "modal.text3": "AI results never replace the advice, diagnosis, or treatment of a trained medical professional.",
      "modal.text4": "Always consult a dermatologist for an accurate diagnosis.",
      "modal.checkbox": "I understand this is not a diagnosis and is only a risk screening tool.",
      "modal.button": "Agree and Continue"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
