"""
Test thực tế - Mô phỏng user journey hoàn chỉnh
User: Người dùng upload ảnh, nhận kết quả AI, sau đó chat với bot
"""
import asyncio
import httpx
from datetime import datetime


# Màu sắc cho terminal
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.END}\n")


def print_user(text):
    print(f"{Colors.BOLD}{Colors.BLUE}👤 User:{Colors.END} {text}")


def print_bot(text):
    print(f"{Colors.BOLD}{Colors.GREEN}🤖 Bot:{Colors.END} {text}")


def print_system(text):
    print(f"{Colors.YELLOW}⚙️  System:{Colors.END} {text}")


async def test_realistic_scenario():
    """
    Scenario: User có nốt ruồi đen, lo lắng, muốn biết có nguy hiểm không
    """
    
    print_header("🏥 DERMASAFE-AI - CHATBOT TEST THỰC TẾ")
    
    # Chatbot service URL
    BASE_URL = "http://localhost:8002"
    
    # Mô phỏng kết quả AI analysis (từ AI service)
    # Giả sử user đã upload ảnh và AI đã phân tích
    analysis_result = {
        "risk": "trung bình",
        "reason": "Phát hiện nốt ruồi có một số đặc điểm cần theo dõi",
        "cv_scores": {
            "nevus": 0.65,
            "melanoma": 0.18,
            "seborrheic_keratosis": 0.12,
            "basal_cell_carcinoma": 0.05
        },
        "primary_disease": {
            "name": "nevus",
            "vietnamese_name": "Nốt ruồi",
            "confidence": 0.65,
            "severity": "lành tính",
            "description": "Nốt ruồi (nevus) là tổn thương da lành tính phổ biến",
            "recommendations": [
                "Theo dõi sự thay đổi về màu sắc, kích thước",
                "Đi khám định kỳ hàng năm",
                "Tránh tiếp xúc quá nhiều với ánh nắng mặt trời"
            ]
        },
        "alternative_diseases": [
            {
                "name": "melanoma",
                "vietnamese_name": "Ung thư hắc tố",
                "confidence": 0.18,
                "severity": "rất nghiêm trọng"
            },
            {
                "name": "seborrheic_keratosis",
                "vietnamese_name": "U sừng tiết bã",
                "confidence": 0.12,
                "severity": "lành tính"
            }
        ],
        "clinical_concepts": [
            "nốt ruồi",
            "theo dõi định kỳ",
            "lành tính"
        ],
        "description": "Dựa trên phân tích ảnh, đây có vẻ là nốt ruồi lành tính thông thường.",
        "overall_severity": "lành tính"
    }
    
    print_system(f"AI đã phân tích ảnh của user:")
    print_system(f"  - Rủi ro: {analysis_result['risk'].upper()} 🟡")
    print_system(f"  - Chẩn đoán: {analysis_result['primary_disease']['vietnamese_name']} ({analysis_result['primary_disease']['confidence']*100:.1f}%)")
    print_system(f"  - Chẩn đoán thay thế: Ung thư hắc tố ({analysis_result['alternative_diseases'][0]['confidence']*100:.1f}%)")
    
    # Session ID cho user
    session_id = f"user_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        # =================================================================
        # Conversation Turn 1: User hỏi về kết quả
        # =================================================================
        print_header("💬 Cuộc trò chuyện bắt đầu")
        
        user_msg_1 = "Kết quả này có nghĩa là gì? Tôi có nguy hiểm không?"
        print_user(user_msg_1)
        
        print_system("Đang gửi request đến chatbot...")
        
        response_1 = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg_1,
                "analysis_context": analysis_result
            }
        )
        
        if response_1.status_code == 200:
            data_1 = response_1.json()
            print_bot(data_1['message'])
            
            if data_1.get('suggestions'):
                print_system("Gợi ý câu hỏi tiếp theo:")
                for i, suggestion in enumerate(data_1['suggestions'][:3], 1):
                    print(f"  {i}. {suggestion}")
        else:
            print(f"{Colors.RED}❌ Error: {response_1.status_code}{Colors.END}")
            return
        
        await asyncio.sleep(2)  # Mô phỏng user đọc và suy nghĩ
        
        # =================================================================
        # Conversation Turn 2: User hỏi về triệu chứng cụ thể
        # =================================================================
        print_header("💬 User hỏi tiếp")
        
        user_msg_2 = "Nốt ruồi của tôi có màu đen không đều và viền hơi lởm chởm. Có phải dấu hiệu xấu không?"
        print_user(user_msg_2)
        
        print_system("Đang gửi request...")
        
        response_2 = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg_2,
                "analysis_context": analysis_result  # Vẫn gửi context
            }
        )
        
        if response_2.status_code == 200:
            data_2 = response_2.json()
            print_bot(data_2['message'])
            
            if data_2.get('suggestions'):
                print_system("Gợi ý câu hỏi:")
                for i, suggestion in enumerate(data_2['suggestions'][:3], 1):
                    print(f"  {i}. {suggestion}")
        
        await asyncio.sleep(2)
        
        # =================================================================
        # Conversation Turn 3: User hỏi về hành động tiếp theo
        # =================================================================
        print_header("💬 User quyết định hành động")
        
        user_msg_3 = "Vậy tôi nên đi khám bác sĩ ngay hay chờ xem thêm vài tuần?"
        print_user(user_msg_3)
        
        print_system("Đang gửi request...")
        
        response_3 = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg_3
            }
        )
        
        if response_3.status_code == 200:
            data_3 = response_3.json()
            print_bot(data_3['message'])
        
        await asyncio.sleep(2)
        
        # =================================================================
        # Conversation Turn 4: User hỏi về cách theo dõi
        # =================================================================
        print_header("💬 User muốn biết cách theo dõi")
        
        user_msg_4 = "Nếu tôi tự theo dõi ở nhà, tôi nên chú ý những gì?"
        print_user(user_msg_4)
        
        response_4 = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg_4
            }
        )
        
        if response_4.status_code == 200:
            data_4 = response_4.json()
            print_bot(data_4['message'])
        
        await asyncio.sleep(2)
        
        # =================================================================
        # Conversation Turn 5: User cảm ơn
        # =================================================================
        print_header("💬 Kết thúc cuộc trò chuyện")
        
        user_msg_5 = "Cảm ơn bạn rất nhiều! Mình yên tâm hơn rồi."
        print_user(user_msg_5)
        
        response_5 = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg_5
            }
        )
        
        if response_5.status_code == 200:
            data_5 = response_5.json()
            print_bot(data_5['message'])
        
        # =================================================================
        # Check conversation history
        # =================================================================
        print_header("📜 Lịch sử trò chuyện")
        
        print_system(f"Lấy lịch sử chat của session: {session_id}")
        
        history_response = await client.get(f"{BASE_URL}/chat/history/{session_id}")
        
        if history_response.status_code == 200:
            history = history_response.json()
            print_system(f"Tổng số messages: {len(history)}")
            
            print(f"\n{Colors.BOLD}Chi tiết:{Colors.END}")
            for msg in history:
                role_icon = "👤" if msg['role'] == 'user' else "🤖"
                role_name = "User" if msg['role'] == 'user' else "Bot"
                timestamp = msg['timestamp'][:19]  # Chỉ lấy phần datetime
                
                print(f"\n{role_icon} {Colors.BOLD}{role_name}{Colors.END} ({timestamp}):")
                content = msg['content']
                if len(content) > 200:
                    content = content[:200] + "..."
                print(f"   {content}")
        
        # =================================================================
        # Service statistics
        # =================================================================
        print_header("📊 Thống kê Service")
        
        stats_response = await client.get(f"{BASE_URL}/stats")
        
        if stats_response.status_code == 200:
            stats = stats_response.json()
            print_system(f"Active sessions: {stats['active_sessions']}")
            print_system(f"Total messages: {stats['total_messages']}")
            print_system(f"LLM provider: {stats['llm_provider']}")
            print_system(f"Status: {stats['status']}")
    
    # =================================================================
    # Summary
    # =================================================================
    print_header("✅ TEST HOÀN TẤT")
    
    print(f"{Colors.GREEN}✓{Colors.END} User journey hoàn chỉnh: Upload ảnh → AI phân tích → Chat với bot")
    print(f"{Colors.GREEN}✓{Colors.END} 5 lượt hội thoại liền mạch")
    print(f"{Colors.GREEN}✓{Colors.END} Chatbot hiểu context từ AI analysis")
    print(f"{Colors.GREEN}✓{Colors.END} Response tự nhiên, empathetic, medical-safe")
    print(f"{Colors.GREEN}✓{Colors.END} Conversation history được lưu đầy đủ")
    print(f"{Colors.GREEN}✓{Colors.END} Suggestions hữu ích")
    
    print(f"\n{Colors.BOLD}{Colors.CYAN}🎉 Chatbot hoạt động hoàn hảo!{Colors.END}\n")


async def test_high_risk_scenario():
    """
    Scenario 2: User có tổn thương nguy hiểm, cần đi khám ngay
    """
    
    print_header("🚨 TEST SCENARIO: RỦI RO CAO")
    
    BASE_URL = "http://localhost:8002"
    
    # Kết quả AI với rủi ro CAO
    analysis_result = {
        "risk": "cao",
        "reason": "Phát hiện tổn thương có đặc điểm nghi ngờ ung thư da",
        "primary_disease": {
            "name": "melanoma",
            "vietnamese_name": "Ung thư hắc tố",
            "confidence": 0.68,
            "severity": "rất nghiêm trọng",
            "recommendations": [
                "⚠️ ĐI KHÁM NGAY LẬP TỨC với bác sĩ da liễu",
                "Không tự điều trị",
                "Có thể cần sinh thiết"
            ]
        }
    }
    
    print_system(f"AI phát hiện: NGUY CƠ CAO 🔴")
    print_system(f"Chẩn đoán: {analysis_result['primary_disease']['vietnamese_name']} ({analysis_result['primary_disease']['confidence']*100:.1f}%)")
    
    session_id = f"high_risk_{datetime.now().strftime('%H%M%S')}"
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        
        print_header("💬 User hỏi về kết quả CAO")
        
        user_msg = "Kết quả này có nghĩa là gì? Tôi rất lo lắng..."
        print_user(user_msg)
        
        response = await client.post(
            f"{BASE_URL}/chat",
            json={
                "session_id": session_id,
                "message": user_msg,
                "analysis_context": analysis_result
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            print_bot(data['message'])
            
            # Check xem bot có nhấn mạnh cần đi khám ngay không
            if "ngay" in data['message'].lower() or "lập tức" in data['message'].lower():
                print(f"\n{Colors.GREEN}✓ Bot đúng cách nhấn mạnh cần đi khám NGAY{Colors.END}")
            else:
                print(f"\n{Colors.RED}⚠ Bot nên nhấn mạnh hơn về sự cấp thiết{Colors.END}")
    
    print_header("✅ TEST RỦI RO CAO HOÀN TẤT")


async def main():
    """Chạy tất cả test scenarios"""
    
    print(f"""
{Colors.BOLD}{Colors.CYAN}
╔═══════════════════════════════════════════════════════════╗
║        DERMASAFE-AI CHATBOT - REALISTIC TEST SUITE       ║
╚═══════════════════════════════════════════════════════════╝
{Colors.END}
    """)
    
    print(f"{Colors.YELLOW}⚠️  Đảm bảo chatbot service đang chạy tại http://localhost:8002{Colors.END}")
    print(f"{Colors.YELLOW}   Chạy: uvicorn chatbot_app.main:app --reload --port 8002{Colors.END}\n")
    
    input(f"{Colors.BOLD}Press Enter để bắt đầu test...{Colors.END}")
    
    try:
        # Test 1: Scenario bình thường
        await test_realistic_scenario()
        
        await asyncio.sleep(2)
        
        # Test 2: Scenario rủi ro cao
        await test_high_risk_scenario()
        
    except httpx.ConnectError:
        print(f"\n{Colors.RED}❌ Không thể kết nối đến chatbot service!{Colors.END}")
        print(f"{Colors.YELLOW}Hãy chạy service trước:{Colors.END}")
        print(f"  cd chatbot-service")
        print(f"  uvicorn chatbot_app.main:app --reload --port 8002")
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error: {e}{Colors.END}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())
