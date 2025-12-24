import os
from fastapi import HTTPException, Header
from supabase import create_client, Client
from dotenv import load_dotenv
import time

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

# Check if Supabase is configured
HAS_SUPABASE_CONFIG = (
    SUPABASE_URL and 
    SUPABASE_SECRET_KEY and 
    SUPABASE_URL != "your_supabase_project_url_here" and
    SUPABASE_SECRET_KEY != "your_supabase_service_role_key_here"
)

if not HAS_SUPABASE_CONFIG:
    print("⚠️ WARNING: Supabase not configured in backend/.env")
    print("🔧 Backend auth will not work properly!")
    supabase = None
else:
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)
        print("✅ Supabase client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {e}")
        supabase = None

def get_current_user(authorization: str = Header(None)):
    """
    Validates the Bearer Token using the official Supabase Python Client.
    Returns the authenticated user object or raises HTTPException.
    
    This dependency can be used in FastAPI routes like:
    @app.get("/api/protected")
    async def protected_route(user = Depends(get_current_user)):
        return {"user_id": user.id, "email": user.email}
    """
    # Check if Supabase is configured
    if not supabase:
        raise HTTPException(
            status_code=503, 
            detail="Authentication service not configured. Please check backend/.env file."
        )

    # Check if authorization header exists
    if not authorization:
        raise HTTPException(
            status_code=401, 
            detail="Missing Authentication Token"
        )
    
    try:
        # Remove 'Bearer ' prefix
        token = authorization.replace("Bearer ", "").strip()
        
        if not token:
            raise HTTPException(
                status_code=401,
                detail="Invalid token format"
            )
        
        # Verify token with Supabase with timeout
        start_time = time.time()
        response = supabase.auth.get_user(token)
        elapsed = time.time() - start_time
        
        # Log slow auth calls
        if elapsed > 1.0:
            print(f"⚠️ Slow auth verification: {elapsed:.2f}s")
        
        if not response or not response.user:
            raise HTTPException(
                status_code=401, 
                detail="Invalid Authentication Token"
            )

        return response.user
        
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        # Log and convert other exceptions to 401
        print(f"❌ Auth verification failed: {e}")
        raise HTTPException(
            status_code=401, 
            detail="Invalid or Expired Token"
        )