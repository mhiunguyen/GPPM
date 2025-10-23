import { AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LangKey = 'vi' | 'en';

interface ProjectInfoTabProps {
  language: LangKey;
}

export default function ProjectInfoTab({ language }: ProjectInfoTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <BookOpen className="w-6 h-6 text-blue-600"/>
          {language === 'vi' ? '📋 Thông tin về DermaSafe-AI' : '📋 About DermaSafe-AI'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {language === 'vi' ? '🎯 Mục đích' : '🎯 Purpose'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {language === 'vi' 
              ? 'DermaSafe-AI là hệ thống sàng lọc nguy cơ da liễu sử dụng AI để hỗ trợ phát hiện sớm các vấn đề về da. Công cụ này KHÔNG thay thế chẩn đoán y khoa mà chỉ giúp bạn đánh giá mức độ ưu tiên khi cần đi khám bác sĩ.'
              : 'DermaSafe-AI is an AI-powered dermatology risk screening system to help with early detection of skin problems. This tool does NOT replace medical diagnosis but helps you assess the priority level when you need to see a doctor.'}
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            {language === 'vi' ? '✨ Tính năng chính' : '✨ Key Features'}
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>{language === 'vi' ? '📸 Phân tích ảnh da bằng AI vision' : '📸 AI vision-based skin image analysis'}</li>
            <li>{language === 'vi' ? '🩺 Kết hợp triệu chứng tự báo cáo' : '🩺 Combined with self-reported symptoms'}</li>
            <li>{language === 'vi' ? '🎯 Đánh giá mức độ nguy cơ (Thấp/Trung/Cao)' : '🎯 Risk level assessment (Low/Medium/High)'}</li>
            <li>{language === 'vi' ? '💡 Khuyến nghị hành động tiếp theo' : '💡 Actionable next-step recommendations'}</li>
            <li>{language === 'vi' ? '🤖 Trợ lý AI chatbot tư vấn 24/7' : '🤖 24/7 AI chatbot assistant'}</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            {language === 'vi' ? '📱 Cách sử dụng' : '📱 How to Use'}
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>{language === 'vi' ? 'Chuyển sang tab "Tải ảnh & Triệu chứng"' : 'Go to "Upload & Symptoms" tab'}</li>
            <li>{language === 'vi' ? 'Tải lên ảnh vùng da cần kiểm tra' : 'Upload an image of the skin area'}</li>
            <li>{language === 'vi' ? 'Chọn triệu chứng bạn đang gặp phải' : 'Select your symptoms'}</li>
            <li>{language === 'vi' ? 'Chọn thời gian xuất hiện triệu chứng' : 'Select symptom duration'}</li>
            <li>{language === 'vi' ? 'Đồng ý với tuyên bố miễn trừ trách nhiệm' : 'Accept the disclaimer'}</li>
            <li>{language === 'vi' ? 'Nhấn "Phân tích" và xem kết quả ở tab "Kết quả"' : 'Click "Analyze" and view results in "Results" tab'}</li>
            <li>{language === 'vi' ? 'Tham khảo thêm với AI chatbot nếu cần' : 'Consult with AI chatbot if needed'}</li>
          </ol>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            {language === 'vi' ? '🔒 Bảo mật & Quyền riêng tư' : '🔒 Privacy & Security'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {language === 'vi'
              ? 'Ảnh và dữ liệu của bạn được xử lý an toàn và không được lưu trữ lâu dài. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn theo các tiêu chuẩn bảo mật cao nhất.'
              : 'Your images and data are processed securely and not stored long-term. We are committed to protecting your privacy with the highest security standards.'}
          </p>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-6">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5"/>
              {language === 'vi' ? '⚠️ Lưu ý quan trọng' : '⚠️ Important Notice'}
            </h4>
            <p className="text-sm text-amber-800">
              {language === 'vi'
                ? 'Công cụ này chỉ mang tính tham khảo và KHÔNG thay thế ý kiến chuyên môn của bác sĩ da liễu. Nếu có bất kỳ lo ngại nào về sức khỏe, vui lòng liên hệ với chuyên gia y tế ngay lập tức.'
                : 'This tool is for reference only and does NOT replace professional medical advice from a dermatologist. If you have any health concerns, please consult a healthcare professional immediately.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
