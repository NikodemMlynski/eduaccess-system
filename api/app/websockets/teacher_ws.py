from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import Dict

router = APIRouter()

connected_teachers: Dict[int, WebSocket] = {}

@router.websocket("/ws/teacher/{teacher_id}")
async def teacher_websocket(websocket: WebSocket, teacher_id: int):
    await websocket.accept()
    connected_teachers[teacher_id] = websocket
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connected_teachers.pop(teacher_id, None)