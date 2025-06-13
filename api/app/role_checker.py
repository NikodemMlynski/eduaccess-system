from fastapi import Depends, HTTPException, status, Request 
from .oauth2 import decode_access_token

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles
    
    def __call__(self, request: Request):
        token = request.headers.get("Authorization")
        if not token:
            raise HTTPException(status_code=403, detail="Token missing")
        
        token = token.replace("Bearer ", "")
        decoded = decode_access_token(token)

        if not decoded or decoded.role not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        request.state.user_id = decoded.user_id
        
admin_only = RoleChecker(["admin"])
teacher_admin = RoleChecker(["admin", "teacher"])
student_only = RoleChecker(["student"])

