from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv(override=True)

account_sid = os.getenv("TWILIO_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

client = Client(account_sid, auth_token)

def send_sms(to_number: str, message: str):
    if not to_number.startswith("+"):
        to_number = "+91" + to_number.strip()
    try:
        message = client.messages.create(
            body=message,
            from_=twilio_number,
            to=to_number
        )
        print(f"✅ SMS sent to {to_number}")
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")
