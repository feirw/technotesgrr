import os
from fastapi import HTTPException, Header
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None

def get_current_user(authorization: str = Header(None)):
    """
    Validates the Bearer Token using the official Supabase Python Client.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Server Auth Configuration Error")

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authentication Token")
    
    try:
        token = authorization.replace("Bearer ", "")
        
        response = supabase.auth.get_user(token)
        
        if not response or not response.user:
             raise HTTPException(status_code=401, detail="Invalid Authentication Token")

        return response.user
        
    except Exception as e:
        print(f"Auth verification failed: {e}")

        raise HTTPException(status_code=401, detail="Invalid or Expired Token")