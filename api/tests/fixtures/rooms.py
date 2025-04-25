@pytest.fixture
def room_factory(session: Session):
    def create_room(school_id: int, room_name: str = "101", capacity: int = 30):
        room = Room(
            school_id=school_id,
            room_name=room_name,
            capacity=capacity,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        session.add(room)
        session.commit()
        session.refresh(room)
        return room
    return create_room
