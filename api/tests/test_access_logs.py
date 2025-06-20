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
# def test_request_access_log_student_granted_by_schedule(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     student, klass, client = authorized_student_class4D_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#         "access_time": start_time.isoformat()
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
#
#
#
# # 2. request_access_log_student_not_assigned_to_any_class
# def test_request_access_log_student_not_assigned_to_any_class(
#         authorized_student_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     student, client = authorized_student_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#         "access_time": start_time.isoformat()
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 400
#     assert data["detail"] == f"Student {student.user.id} is not assigned to any class."
#
# # 3. request_access_log_student_denied_by_schedule
# def test_request_access_log_student_denied_by_schedule_lesson_not_existing(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     student, klass, client = authorized_student_class4D_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#         "access_time": start_time.isoformat()
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     assert res.status_code == 200
#     assert data["access_status"] == "denied"
#
# def test_request_access_log_student_denied_by_schedule_student_not_assigned_to_class_having_lesson(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     student, _, client = authorized_student_class4D_client
#     school_id = student.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="3C")
#     room = room_factory(school_id=school_id)
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#         "access_time": start_time.isoformat()
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     assert res.status_code == 200
#     assert data["access_status"] == "denied"
# # 4. request_access_log_already_exists
#
# def test_request_access_log_student_access_log_already_exists(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     student, klass, client = authorized_student_class4D_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     access_log = access_logs_factory(
#         access_start_time=start_time.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="granted",
#         reason="Student currently have lesson in this classroom"
#     )
#     access_time = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#         "access_time": access_time.isoformat()
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
#     assert data["access_end_time"] == access_time.isoformat()
#
# # 5. request_access_log_invalid_data
# def test_request_access_log_student_uncomplete_data(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     student, klass, client = authorized_student_class4D_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 422
#     assert data["detail"] == [{'input': {'room_id': 1, 'user_id': 2}, 'loc': ['body', 'access_time'], 'msg': 'Field required', 'type': 'missing'}]
#
# # 6. request_access_log_provided_user_is_not_student
# def test_request_access_log_provided_user_is_not_student(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     teacherC, client = authorized_teacher_client
#     school_id = teacherC.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     room = room_factory(school_id=school_id)
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#     template = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#     payload = {
#         "user_id": student.user.id,
#         "room_id": room.id,
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/request", json=payload)
#     data = res.json()
#     assert res.status_code == 403
#     assert data["detail"] == "Insufficient permissions"


# 7. get_all_denied_access_logs_for_teacher
# def test_get_all_denied_access_logs_by_teacher(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     teacher, client = authorized_teacher_client
#     school_id = teacher.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     not_used_klass = classes_factory(school_id=school_id, class_name="4E")
#     student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=not_used_klass.id)
#     room = room_factory(school_id=school_id)
#
#     template1 = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#     access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template1.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#     access_log2 = access_logs_factory(
#         access_start_time=access_time2.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{access_time2.isoformat()}")
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert len(data) == 2
#     for access_log in data:
#         assert access_log["access_status"] == "denied"
#
# # 8. get_all_denied_access_logs_for_teacher_time_edge_case
# def test_get_all_denied_access_logs_by_teacher_time_edge_case(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     teacher, client = authorized_teacher_client
#     school_id = teacher.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     not_used_klass = classes_factory(school_id=school_id, class_name="4E")
#     student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=not_used_klass.id)
#     room = room_factory(school_id=school_id)
#
#     template1 = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#     access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)
#     # ten minutes from last access log
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template1.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#     access_log2 = access_logs_factory(
#         access_start_time=access_time2.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert len(data) == 1
#     data[0]["access_status"] == "denied"
# # 9. get_all_denied_access_logs_for_teacher_not_in_time_range
# def test_get_all_denied_access_logs_by_teacher_not_in_time_range(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     teacher, client = authorized_teacher_client
#     school_id = teacher.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     not_used_klass = classes_factory(school_id=school_id, class_name="4E")
#     student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=not_used_klass.id)
#     room = room_factory(school_id=school_id)
#
#     template1 = lesson_template_factory(
#         school_id=school_id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         class_id=klass.id,
#         start_time="10:05",
#         end_time="10:50",
#         weekday=0
#     )
#
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)
#     # twelve minutes from last access log
#
#     lesson_instance = lesson_instance_factory(
#         template_id=template1.id,
#         class_id=klass.id,
#         room_id=room.id,
#         teacher_id=teacher.id,
#         subject="computer science",
#         start_time=start_time,
#         end_time=end_time,
#     )
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert len(data) == 0
# 10. get_all_denied_access_logs_for_teacher_not_having_lesson
def test_get_all_denied_access_logs_for_teacher_not_having_lesson(
        authorized_teacher_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
):
    teacher, client = authorized_teacher_client
    school_id = teacher.user.school_id

    teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)

    res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
    data = res.json()
    assert res.status_code == 404
    assert data["detail"] == f"Lesson instance for teacher {teacher.id} not found."

# 11. get_all_denied_access_logs_for_teacher_as_student
def test_get_all_denied_access_logs_for_teacher_not_permitted(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
):
    student, client = authorized_student_client
    school_id = student.user.school_id
    teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")

    teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)

    res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
    data = res.json()
    assert res.status_code == 403
    assert data["detail"] == "Insufficient permissions"

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