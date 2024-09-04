import requests

def test_preregistration():
    url = "http://localhost:8080/api/preregister"
    data = {
        "email": "test1@example.com",
        "phone": "01012235678",
        "privacy_consent": True
    }

    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    if response.status_code == 200:
        print("사전등록 성공!")
        print(f"쿠폰 코드: {response.json().get('coupon_code')}")
    else:
        print("사전등록 실패")

if __name__ == "__main__":
    test_preregistration()