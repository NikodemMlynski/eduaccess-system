from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import Dict

router = APIRouter()

connected_users: Dict[int, WebSocket] = {}
@router.websocket("/ws/users_requests_approvals/{user_id}")
async def users_requests_approvals(websocket: WebSocket, user_id: int):
    await websocket.accept()
    connected_users[user_id] = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_users.pop(user_id, None)