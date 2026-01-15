"""Test OCR accuracy against blood gas images"""
import base64
import json
import requests
import os
import sys

# Get backend URL
API_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8001')
if not API_URL.startswith('http'):
    API_URL = 'http://localhost:8001'

# Test images
TEST_IMAGES = [
    '/app/test_images/img1.jpg',
    '/app/test_images/img2.jpg',
    '/app/test_images/img3.jpg',
    '/app/test_images/img4.jpg',
    '/app/test_images/img5.jpg',
]

def test_image(image_path):
    """Test a single image"""
    print(f"\n{'='*60}")
    print(f"Testing: {os.path.basename(image_path)}")
    print('='*60)
    
    # Read and encode image
    with open(image_path, 'rb') as f:
        img_data = base64.b64encode(f.read()).decode('utf-8')
    
    # Call OCR endpoint
    response = requests.post(
        f"{API_URL}/api/blood-gas/analyze-image-offline",
        json={"image_base64": img_data},
        timeout=120
    )
    
    if response.status_code != 200:
        print(f"ERROR: Status {response.status_code}")
        print(response.text)
        return None
    
    result = response.json()
    
    # Print results
    print(f"\nSuccess: {result.get('success', False)}")
    print(f"Confidence: {result.get('avg_confidence', 0):.1%}")
    
    print(f"\n--- Extracted Values ---")
    values = result.get('extracted_values', {})
    if values:
        for k, v in sorted(values.items()):
            print(f"  {k}: {v}")
    else:
        print("  (no values extracted)")
    
    print(f"\n--- Raw Lines (first 20) ---")
    lines = result.get('lines', [])
    for line in lines[:20]:
        print(f"  {line}")
    
    if result.get('low_confidence_warning'):
        print(f"\n⚠️  {result['low_confidence_warning']}")
    
    return result

def main():
    print("="*60)
    print("OCR ACCURACY TEST")
    print("="*60)
    
    all_results = []
    
    for img_path in TEST_IMAGES:
        if os.path.exists(img_path):
            result = test_image(img_path)
            if result:
                all_results.append({
                    'image': os.path.basename(img_path),
                    'success': result.get('success', False),
                    'confidence': result.get('avg_confidence', 0),
                    'metrics_count': len(result.get('extracted_values', {})),
                    'metrics': result.get('extracted_values', {})
                })
        else:
            print(f"\nSkipping (not found): {img_path}")
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    for r in all_results:
        status = "✓" if r['metrics_count'] >= 3 else "✗"
        print(f"{status} {r['image']}: {r['metrics_count']} metrics @ {r['confidence']:.1%} confidence")
    
    total_metrics = sum(r['metrics_count'] for r in all_results)
    avg_conf = sum(r['confidence'] for r in all_results) / len(all_results) if all_results else 0
    print(f"\nTotal: {total_metrics} metrics across {len(all_results)} images")
    print(f"Average confidence: {avg_conf:.1%}")

if __name__ == "__main__":
    main()
