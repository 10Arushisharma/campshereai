import requests

response = requests.post(
    "http://127.0.0.1:8000/api/auth/register",
    json={
        "name": "Test Student",
        "email": "student@test.com",
        "password": "password123",
        "role": "student"
    }
)
print(response.status_code)
print(response.text)
