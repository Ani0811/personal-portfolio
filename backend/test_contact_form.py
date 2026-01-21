"""
Test script to verify contact form functionality.
Run this after starting the Django server.

Usage:
    python test_contact_form.py
"""
import json

# `requests` is convenient but optional for this helper test script.
# Try to import it and fall back to a minimal urllib-based POST implementation
# so the script works even if `requests` is not installed (avoids editor/runtime errors).
try:
    import requests  # type: ignore
    _HAS_REQUESTS = True
except Exception:
    requests = None  # type: ignore
    _HAS_REQUESTS = False
    import urllib.request as _urllib_request
    import urllib.error as _urllib_error

    class _SimpleResponse:
        def __init__(self, code, body_bytes):
            self.status_code = code
            self._body = body_bytes

        def json(self):
            try:
                return json.loads(self._body.decode('utf-8'))
            except Exception:
                return {}

    def _urllib_post(url, json_data):
        data = json.dumps(json_data).encode('utf-8')
        req = _urllib_request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
        try:
            with _urllib_request.urlopen(req) as resp:
                body = resp.read()
                return _SimpleResponse(resp.getcode(), body)
        except _urllib_error.HTTPError as e:
            body = e.read() if hasattr(e, 'read') else b''
            return _SimpleResponse(e.code if hasattr(e, 'code') else 500, body)

    # Provide a `post` function variable used below by tests
    def _post(url, json_data):
        return _urllib_post(url, json_data)


# Configuration
BASE_URL = "http://localhost:8000"  # Change to your backend URL
CONTACT_ENDPOINT = f"{BASE_URL}/api/contact/"

def test_contact_form():
    """Test contact form submission with valid data."""
    test_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone_number": "+1234567890",
        "message": "This is a test message to verify the contact form is working correctly. The system should save this to database, JSON backup, and logs."
    }
    
    print("=" * 80)
    print("Testing Contact Form Submission")
    print("=" * 80)
    print(f"\nEndpoint: {CONTACT_ENDPOINT}")
    print(f"\nTest Data:")
    print(json.dumps(test_data, indent=2))
    print("\nSending request...")
    
    try:
        if _HAS_REQUESTS:
            response = requests.post(CONTACT_ENDPOINT, json=test_data)
        else:
            response = _post(CONTACT_ENDPOINT, test_data)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 201:
            print("\n✅ SUCCESS! Contact form is working correctly.")
            print("\nVerify the message by:")
            print("1. Checking Django admin: http://localhost:8000/admin/")
            print("2. Looking at backend/contact_backups/contact_messages.json")
            print("3. Checking the console logs")
        else:
            print("\n❌ FAILED! Unexpected status code.")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to backend.")
        print("Make sure the Django server is running: python manage.py runserver")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
    
    print("=" * 80)


def test_validation():
    """Test contact form validation."""
    print("\n" + "=" * 80)
    print("Testing Validation")
    print("=" * 80)
    
    invalid_data = {
        "name": "A",  # Too short
        "email": "invalid-email",  # Invalid format
        "message": "Short"  # Too short
    }
    
    print(f"\nInvalid Data:")
    print(json.dumps(invalid_data, indent=2))
    print("\nSending request...")
    
    try:
        if _HAS_REQUESTS:
            response = requests.post(CONTACT_ENDPOINT, json=invalid_data)
        else:
            response = _post(CONTACT_ENDPOINT, invalid_data)
        
        print(f"\nStatus Code: {response.status_code}")
        print(f"\nResponse:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 400:
            print("\n✅ Validation working correctly! Invalid data was rejected.")
        else:
            print("\n❌ Unexpected response to invalid data.")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
    
    print("=" * 80)


if __name__ == "__main__":
    test_contact_form()
    test_validation()
