import pytest
from .conftest import (authorized_admin_client,
                       authorized_teacher_client,
                       authorized_student_client,
                        authorized_student_class4D_client
                       )
from .fixtures.lesson_instances import lesson_instance_factory
from .fixtures.lesson_templates import lesson_template_factory
from .fixtures.rooms import room_factory
from .fixtures.school import school_admin_factory
from .fixtures.users import user_factory
from .fixtures.classes import classes_factory
from datetime import datetime
from datetime import datetime, timedelta
from .fixtures.attendances import attendance_factory
from .fixtures.access_logs import access_logs_factory


# TESTS:
# 1. request_access_log_student_granted_by_schedule
def test_request_access_log_student_granted_by_schedule(
        authorized_student_class4D_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
):
    student, klass, client = authorized_student_class4D_client
    school_id = student.user.school_id
    room = room_factory(school_id=school_id)
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
    template = lesson_template_factory(
        school_id=school_id,
        room_id=room.id,
        teacher_id=teacher.id,
        class_id=klass.id,
        start_time="10:05",
        end_time="10:50",
        weekday=0
    )


    start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
    end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)

    lesson_instance = lesson_instance_factory(
        template_id=template.id,
        class_id=klass.id,
        room_id=room.id,
        teacher_id=teacher.id,
        subject="computer science",
        start_time=start_time,
        end_time=end_time,
    )
    payload = {
        "user_id": student.user.id,
        "room_id": room.id,
        "access_time": start_time.isoformat()
    }

    res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
    data = res.json()
    print(data)
    assert res.status_code == 200
# 2. request_access_log_student_not_assigned_to_any_class

# 3. request_access_log_student_denied_by_schedule
# 4. request_access_log_already_exists
# 5. request_access_log_invalid_data
# 6. request_access_log_provided_user_is_not_student

# 7. get_all_denied_access_logs_for_teacher
# 8. get_all_denied_access_logs_for_teacher_time_edge_case
# 9. get_all_denied_access_logs_for_teacher_not_in_time_range
# 10. get_all_denied_access_logs_for_teacher_not_having_lesson
# 11. get_all_denied_access_logs_for_teacher_as_student

# 12. approve_access_log_success
# 13. deny_access_log_success
# 14. review_access_log_invalid_status
# 15. review_access_log_not_found_access_log
# 16. review_access_log_outdated_access_log
# 17. review_access_log_teacher_not_having_lesson

# 18. open_door_as_teacher_success
# 19. open_door_as_admin_success
# 20. open_door_as_student
# 21. close_door_as_teacher_success
# 22. open_door_as_teacher_invalid_data_in

# 23. get_all_access_logs_not_permitted
# 24. get_all_access_logs_as_admin_success
# 25. get_all_access_logs_as_admin_date_range
# 26. get_all_access_logs_empty_list
# 27. get_all_access_logs_paginated
# 28. get_all_access_logs_paginated_for_specific_room_id

# 29. get_attendance_after_successful_student_request_status_present
# 30. get_attendance_after_successful_student_request_status_absent
# 31. get_attendance_after_successful_student_request_status_late

# here will be also tests for websockets for:
#   - students request endpoint
#   - teacher approval endpoint