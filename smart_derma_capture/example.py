"""
Example usage of smart_derma_capture module
"""

from smart_derma_capture import DermaAnalyzer, SmartCapture
import cv2


def example_1_simple_analysis():
    """Example 1: Simple disease analysis"""
    print("\n" + "="*60)
    print("Example 1: Simple Analysis")
    print("="*60)
    
    analyzer = DermaAnalyzer()
    
    # Replace with your image path
    result = analyzer.analyze("path/to/skin_image.jpg")
    
    print(f"\n🔬 Analysis Result:")
    print(f"Disease: {result.primary_disease.vietnamese_name}")
    print(f"Confidence: {result.primary_disease.confidence:.1%}")
    print(f"Severity: {result.overall_severity.value}")
    
    print(f"\n💡 Recommendations:")
    for i, rec in enumerate(result.recommendations, 1):
        print(f"{i}. {rec}")


def example_2_quality_check():
    """Example 2: Image quality check"""
    print("\n" + "="*60)
    print("Example 2: Quality Check")
    print("="*60)
    
    capture = SmartCapture()
    
    # Check quality
    quality = capture.check_quality("path/to/image.jpg")
    
    print(f"\n📊 Quality Report:")
    print(f"Score: {quality['score']}/100")
    print(f"Acceptable: {'✅ Yes' if quality['is_acceptable'] else '❌ No'}")
    print(f"Recommendation: {quality['recommendation']}")
    
    if quality['issues']:
        print(f"\n⚠️ Issues Found:")
        for issue in quality['issues']:
            print(f"  - {issue['message']}")
            print(f"    → {issue['suggestion']}")


def example_3_smart_capture():
    """Example 3: Smart capture with enhancement"""
    print("\n" + "="*60)
    print("Example 3: Smart Capture Pipeline")
    print("="*60)
    
    capture = SmartCapture()
    
    # Process image
    enhanced, report = capture.process("path/to/image.jpg", auto_crop=True)
    
    print(f"\n📸 Capture Report:")
    print(f"Quality Before: {report['quality_before']['score']}/100")
    print(f"Quality After: {report['quality_after']['score']}/100")
    print(f"Improvement: +{report['improvement']} points")
    print(f"Final Status: {'✅ Acceptable' if report['final_acceptable'] else '❌ Need Retake'}")
    
    # Save enhanced image
    cv2.imwrite("enhanced_output.jpg", enhanced)
    print("\n💾 Saved enhanced image to: enhanced_output.jpg")


def example_4_complete_pipeline():
    """Example 4: Complete analysis pipeline"""
    print("\n" + "="*60)
    print("Example 4: Complete Pipeline")
    print("="*60)
    
    # 1. Smart Capture
    print("\n[Step 1] Smart Capture...")
    capture = SmartCapture()
    enhanced, report = capture.process("path/to/image.jpg", auto_crop=True)
    
    if not report['final_acceptable']:
        print("❌ Image quality too low. Please retake photo.")
        print("\n📋 Guidelines:")
        for tip in capture.get_quick_tips():
            print(f"  • {tip}")
        return
    
    print(f"✅ Quality acceptable ({report['quality_after']['score']}/100)")
    
    # 2. Disease Analysis
    print("\n[Step 2] Analyzing disease...")
    analyzer = DermaAnalyzer()
    result = analyzer.analyze(enhanced)
    
    # 3. Display Results
    print(f"\n🎯 Final Results:")
    print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"Disease: {result.primary_disease.vietnamese_name}")
    print(f"Confidence: {result.primary_disease.confidence:.1%}")
    print(f"Severity: {result.overall_severity.value}")
    
    print(f"\n🏥 Top 3 Possibilities:")
    for i, disease in enumerate(result.diseases[:3], 1):
        print(f"{i}. {disease.vietnamese_name} ({disease.confidence:.1%})")
    
    print(f"\n💊 Recommendations:")
    for i, rec in enumerate(result.recommendations, 1):
        print(f"{i}. {rec}")
    
    # 4. Save results
    cv2.imwrite("final_enhanced.jpg", enhanced)
    print(f"\n💾 Saved to: final_enhanced.jpg")


def example_5_realtime_check():
    """Example 5: Real-time quality check (for camera)"""
    print("\n" + "="*60)
    print("Example 5: Real-time Check (Camera Preview)")
    print("="*60)
    
    capture = SmartCapture()
    
    # Simulate camera frame
    frame = cv2.imread("path/to/camera_frame.jpg")
    
    # Fast check
    realtime = capture.check_realtime(frame)
    
    print(f"\n⚡ Real-time Status:")
    print(f"Ready to Capture: {'✅ YES' if realtime['ready_to_capture'] else '❌ NO'}")
    print(f"Brightness: {realtime['brightness']}")
    print(f"Sharpness: {realtime['sharpness']}")
    
    if realtime['issues']:
        print(f"\n⚠️ Current Issues:")
        for issue in realtime['issues']:
            print(f"  - {issue}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("� Smart Derma Capture - Usage Examples")
    print("="*60)
    
    print("\n📝 Note: Replace 'path/to/image.jpg' with your actual image path")
    
    # Uncomment the example you want to run:
    
    # example_1_simple_analysis()
    # example_2_quality_check()
    # example_3_smart_capture()
    # example_4_complete_pipeline()
    # example_5_realtime_check()
    
    print("\n" + "="*60)
    print("✅ Examples completed!")
    print("="*60 + "\n")
