"""
Test script cho Chatbot Service
Chạy: python test_chatbot.py
"""
import asyncio
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from chatbot_app.gemini_client import GeminiClient
from chatbot_app.conversation import ConversationManager
from chatbot_app.schemas import ChatMessage, AnalysisContext


async def test_gemini_connection():
    """Test 1: Kiểm tra kết nối Gemini"""
    print("\n" + "="*60)
    print("TEST 1: Gemini Connection")
    print("="*60)
    
    try:
        client = GeminiClient()
        
        # Test connection
        if client.test_connection():
            print("✅ Gemini API connection: OK")
        else:
            print("❌ Gemini API connection: FAILED")
            return False
        
        # Test simple chat
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say hello in Vietnamese"}
        ]
        
        response = await client.chat(messages)
        print(f"✅ Gemini response: {response[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


async def test_conversation_manager():
    """Test 2: Conversation Manager"""
    print("\n" + "="*60)
    print("TEST 2: Conversation Manager")
    print("="*60)
    
    try:
        manager = ConversationManager()
        
        # Add messages
        manager.add_message("test-session", ChatMessage(
            role="user",
            content="Hello"
        ))
        manager.add_message("test-session", ChatMessage(
            role="assistant",
            content="Hi there!"
        ))
        
        # Get messages
        messages = manager.get_messages("test-session")
        print(f"✅ Stored messages: {len(messages)}")
        
        # Build LLM messages
        llm_messages = manager.build_llm_messages("test-session")
        print(f"✅ LLM messages count: {len(llm_messages)}")
        
        # Clear session
        manager.clear_session("test-session")
        print(f"✅ Session cleared")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


async def test_full_chat_flow():
    """Test 3: Full chat flow with analysis context"""
    print("\n" + "="*60)
    print("TEST 3: Full Chat Flow (with Analysis Context)")
    print("="*60)
    
    try:
        client = GeminiClient()
        manager = ConversationManager()
        
        # Create analysis context
        context = AnalysisContext(
            risk="cao",
            reason="Phát hiện tổn thương nguy hiểm",
            primary_disease={
                "name": "melanoma",
                "vietnamese_name": "Ung thư hắc tố",
                "confidence": 0.72,
                "severity": "rất nghiêm trọng"
            },
            recommendations=[
                "⚠️ ĐI KHÁM NGAY LẬP TỨC với bác sĩ da liễu"
            ]
        )
        
        # User message
        user_message = ChatMessage(
            role="user",
            content="Kết quả này có nghĩa là gì? Tôi có nên lo lắng không?"
        )
        manager.add_message("test-session-2", user_message)
        
        # Build messages
        llm_messages = manager.build_llm_messages(
            session_id="test-session-2",
            analysis_context=context
        )
        
        print(f"📊 Context: Risk={context.risk}, Disease={context.primary_disease['vietnamese_name']}")
        print(f"💬 User message: {user_message.content}")
        print(f"🤖 Calling Gemini...")
        
        # Get response
        response = await client.chat(llm_messages)
        
        print(f"\n✅ Assistant response:")
        print("-" * 60)
        print(response)
        print("-" * 60)
        
        # Save response
        assistant_message = ChatMessage(
            role="assistant",
            content=response
        )
        manager.add_message("test-session-2", assistant_message)
        
        print(f"\n✅ Conversation saved ({len(manager.get_messages('test-session-2'))} messages)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_multiple_turns():
    """Test 4: Multiple conversation turns"""
    print("\n" + "="*60)
    print("TEST 4: Multiple Conversation Turns")
    print("="*60)
    
    try:
        client = GeminiClient()
        manager = ConversationManager()
        session_id = "test-multi-turn"
        
        questions = [
            "Xin chào! Bạn có thể giúp tôi không?",
            "Nốt ruồi của tôi có màu đen và có chút lồi. Có sao không?",
            "Tôi nên đi khám bác sĩ khi nào?"
        ]
        
        for i, question in enumerate(questions, 1):
            print(f"\n--- Turn {i} ---")
            print(f"User: {question}")
            
            # Add user message
            manager.add_message(session_id, ChatMessage(
                role="user",
                content=question
            ))
            
            # Build messages
            llm_messages = manager.build_llm_messages(session_id)
            
            # Get response
            response = await client.chat(llm_messages)
            
            print(f"Bot: {response[:150]}...")
            
            # Save response
            manager.add_message(session_id, ChatMessage(
                role="assistant",
                content=response
            ))
        
        print(f"\n✅ Completed {len(questions)} turns")
        print(f"✅ Total messages in session: {len(manager.get_messages(session_id))}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


async def main():
    """Run all tests"""
    print("\n" + "🧪"*30)
    print("DERMASAFE-AI CHATBOT SERVICE - TEST SUITE")
    print("🧪"*30)
    
    tests = [
        ("Gemini Connection", test_gemini_connection),
        ("Conversation Manager", test_conversation_manager),
        ("Full Chat Flow", test_full_chat_flow),
        ("Multiple Turns", test_multiple_turns),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Chatbot is ready to use.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Please check the errors above.")
    
    print("="*60)


if __name__ == "__main__":
    # Check if .env exists
    env_file = Path(__file__).parent / ".env"
    if not env_file.exists():
        print("\n⚠️ WARNING: .env file not found!")
        print("Please create .env file with your GEMINI_API_KEY")
        print("Example: cp .env.example .env")
        sys.exit(1)
    
    # Run tests
    asyncio.run(main())
