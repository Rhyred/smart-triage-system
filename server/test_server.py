#!/usr/bin/env python3
"""
Simple test script to verify server functionality
"""
import requests
import json
import time

def test_server():
    base_url = "http://localhost:8000"

    # Test data
    test_cases = [
        {
            "name": "Normal health",
            "data": {
                "temperature": 36.8,
                "spo2": 98,
                "heartRate": 72,
                "bloodPressure": {"systolic": 120, "diastolic": 80},
                "respiratoryRate": 16
            }
        },
        {
            "name": "Critical health",
            "data": {
                "temperature": 39.2,
                "spo2": 88,
                "heartRate": 130,
                "bloodPressure": {"systolic": 170, "diastolic": 110},
                "respiratoryRate": 35
            }
        }
    ]

    print("🧪 Testing Health Triage Server")
    print("=" * 40)

    for test_case in test_cases:
        print(f"\n📋 Testing: {test_case['name']}")
        try:
            response = requests.post(
                f"{base_url}/analyze",
                json=test_case['data'],
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                print("✅ Success!"                print(f"   Status: {result['healthData']['status']}")
                print(f"   Risk Level: {result['healthData']['riskLevel']}")
                print(f"   Message: {result['healthData']['message']}")
                print(f"   Symptoms: {', '.join(result['healthData']['symptoms'])}")
                print(f"   Confidence: {result['confidence']:.1%}")
            else:
                print(f"❌ HTTP {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")

        time.sleep(1)  # Brief pause between tests

    print("\n🎉 Testing completed!")

if __name__ == "__main__":
    test_server()