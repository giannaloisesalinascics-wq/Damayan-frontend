import urllib.request
import json
import sys

try:
    data = json.dumps({'email': 'nonexistent@example.com', 'password': 'wrongpassword'}).encode()
    req = urllib.request.Request('http://localhost:3001/api/auth/login', 
                                data=data, 
                                headers={'Content-Type': 'application/json'})
    response = urllib.request.urlopen(req)
    print(f"Status: {response.status}")
    print(f"Response: {response.read().decode()}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Response: {e.read().decode()}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
