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
# def test_request_access_log_student_authorized_as_different_student_than_provided_in_request(
#         authorized_student_class4D_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     studentC, _, client = authorized_student_class4D_client
#     school_id = studentC.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4E")
#     room = room_factory(school_id=school_id)
#     student = user_factory(school_id=school_id, role='student', email="student12@example.com", class_id=klass.id)
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
#     assert res.status_code == 403
#     assert data["detail"] == "You are not permitted to access data for another user"
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
# def test_get_all_denied_access_logs_for_teacher_not_having_lesson(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
# ):
#     teacher, client = authorized_teacher_client
#     school_id = teacher.user.school_id
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)
#
#     res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
#     data = res.json()
#     assert res.status_code == 404
#     assert data["detail"] == f"Lesson instance for teacher {teacher.id} not found."
#
# # 11. get_all_denied_access_logs_for_teacher_as_student
# def test_get_all_denied_access_logs_for_teacher_not_permitted(
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
#     teacher = user_factory(school_id=school_id, role='teacher', email="teacher1@example.com")
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=19)
#
#     res = client.get(f"/school/{school_id}/access-logs/request/teacher_id/{teacher.user.id}/current_time/{teacher_search_time.isoformat()}")
#     data = res.json()
#     assert res.status_code == 403
#     assert data["detail"] == "Insufficient permissions"

# 12. approve_access_log_success
# def test_approve_access_log_success(
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
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=10)
#     # twelve minutes from last access log
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
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "granted"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/{access_log1.id}", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
# # 13. deny_access_log_success
# def test_deny_access_log_success(
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
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=10)
#     # twelve minutes from last access log
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
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "denied"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/{access_log1.id}", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "denied"
# # 14. review_access_log_invalid_status
# def test_review_access_log_invalid_status(
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
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=10)
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "invalid_status"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/1", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 400
#     assert data["detail"] == "Invalid approval status: invalid_status"
# # 15. review_access_log_not_found_access_log
# def test_review_access_log_not_found(
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
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=10)
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "denied"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/1", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 404
#     assert data["detail"] == "Access log 1 not found"
# # 16. review_access_log_outdated_access_log
# def test_review_access_log_outdated_access_log(
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
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=18)
#     # twelve minutes from last access log
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
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "denied"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/{access_log1.id}", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 400
#     assert data["detail"] == f"Access log {access_log1.id} is outdated"

# 17. review_access_log_teacher_not_having_lesson
# def test_review_access_teacher_not_having_lesson(
#         authorized_teacher_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     teacherC, client = authorized_teacher_client
#     school_id = teacherC.user.school_id
#     klass = classes_factory(school_id=school_id, class_name="4D")
#     not_used_klass = classes_factory(school_id=school_id, class_name="4E")
#     student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=not_used_klass.id)
#     teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
#     room = room_factory(school_id=school_id)
#
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
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=14)
#     # twelve minutes from last access log
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
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     payload = {
#         "user_id": teacherC.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "denied"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/{access_log1.id}", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 404
#     assert data["detail"] == "Lesson instance for teacher 1 not found."
#
# def test_review_access_teacher_not_having_lesson_in_specific_room(
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
#     # teacher = user_factory(role="teacher", school_id=school_id, email="teacher1@example.com")
#     room = room_factory(school_id=school_id)
#     access_room = room_factory(school_id=school_id)
#
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
#     start_time = datetime(year=2025, month=5, day=15, hour=10, minute=5)
#     end_time = datetime(year=2025, month=5, day=15, hour=10, minute=50)
#
#     access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     teacher_search_time = datetime(year=2025, month=5, day=15, hour=10, minute=14)
#     # twelve minutes from last access log
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
#
#     access_log1 = access_logs_factory(
#         access_start_time=access_time1.isoformat(),
#         room_id=access_room.id,
#         user_id=student.user.id,
#         access_status="denied",
#         reason="Student currently do not have lesson in this classroom"
#     )
#
#     payload = {
#         "user_id": teacher.user_id,
#         "current_time": teacher_search_time.isoformat(),
#         "status": "denied"
#     }
#
#     res = client.put(f"/school/{school_id}/access-logs/handle_approval/{access_log1.id}", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 403
#     assert data["detail"] == "Teacher currently do not have lesson in this room."

# 18. open_door_as_teacher_success
# def test_open_door_as_teacher_success(
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
#     room = room_factory(school_id=school_id)
#
#     access_time = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     payload = {
#         "user_id": teacher.user_id,
#         "access_time": access_time.isoformat(),
#         "room_id": room.id
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/open_close_door", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
#     assert data["access_start_time"] == access_time.isoformat()
# # 19. open_door_as_admin_success
# def test_open_door_as_admin_success(
#         authorized_admin_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
#         test_school_and_admin
# ):
#     school, client = authorized_admin_client
#     school_id = school.id
#     _, admin_user = test_school_and_admin
#     room = room_factory(school_id=school_id)
#     access_time = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     payload = {
#         "user_id": admin_user.id,
#         "access_time": access_time.isoformat(),
#         "room_id": room.id
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/open_close_door", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
#     assert data["access_start_time"] == access_time.isoformat()
# # 20. open_door_as_student
#
# def test_open_door_as_student_not_permitted(
#         authorized_student_client,
#         session,
#         lesson_template_factory,
#         lesson_instance_factory,
#         room_factory,
#         user_factory,
#         classes_factory,
#         access_logs_factory,
# ):
#     student, client = authorized_student_client
#     school_id = student.user.school_id
#     room = room_factory(school_id=school_id)
#
#     access_time = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#
#     payload = {
#         "user_id": student.user_id,
#         "access_time": access_time.isoformat(),
#         "room_id": room.id
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/open_close_door", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 403
#     assert data["detail"] == "Insufficient permissions"
#
# # 21. close_door_as_teacher_success
# def test_close_door_as_teacher_success(
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
#     room = room_factory(school_id=school_id)
#
#     access_start_time = datetime(year=2025, month=5, day=15, hour=10, minute=7)
#     access_end_time = datetime(year=2025, month=5, day=15, hour=10, minute=15)
#
#     access_log = access_logs_factory(
#         access_start_time=access_start_time.isoformat(),
#         room_id=room.id,
#         user_id=teacher.user.id,
#         access_status="granted",
#         reason="Teachers and admins can access any room"
#     )
#
#     payload = {
#         "user_id": teacher.user_id,
#         "access_time": access_end_time.isoformat(),
#         "room_id": room.id
#     }
#
#     res = client.post(f"/school/{school_id}/access-logs/open_close_door", json=payload)
#     data = res.json()
#     print(data)
#     assert res.status_code == 200
#     assert data["access_status"] == "granted"
#     assert data["access_start_time"] == access_start_time.isoformat()
#     assert data["access_end_time"] == access_end_time.isoformat()

# 23. get_all_access_logs_not_permitted
def test_get_all_access_logs_not_permitted(
        authorized_student_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    student, client = authorized_student_client
    school_id = student.user.school_id
    room = room_factory(school_id=school_id)



    res = client.get(f"/school/{school_id}/access-logs")
    data = res.json()
    assert res.status_code == 403
    assert data["detail"] == "Insufficient permissions"

# 24. get_all_access_logs_as_admin_success
def test_get_all_access_logs_as_admin_success(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4E")
    student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=klass.id)
    room = room_factory(school_id=school_id)

    access_time1 = datetime(year=2025, month=5, day=15, hour=10, minute=7)
    access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)


    access_log1 = access_logs_factory(
        access_start_time=access_time1.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )
    access_log2 = access_logs_factory(
        access_start_time=access_time2.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )

    res = client.get(f"/school/{school_id}/access-logs")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data["total_count"] == 2
    assert len(data["access_logs"]) == 2


# 25. get_all_access_logs_as_admin_date_range
def test_get_all_access_logs_as_admin_date_range(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=klass.id)
    room = room_factory(school_id=school_id)


    access_time1 = datetime(year=2025, month=5, day=17, hour=10, minute=7)
    access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)

    search_start_date = "2025-05-15"
    search_end_date = "2025-05-16"

    access_log1 = access_logs_factory(
        access_start_time=access_time1.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )
    access_log2 = access_logs_factory(
        access_start_time=access_time2.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )

    res = client.get(f"/school/{school_id}/access-logs?start_date={search_start_date}&end_date={search_end_date}")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data["total_count"] == 1
    assert len(data["access_logs"]) == 1
# 26. get_all_access_logs_empty_list
def test_get_all_access_logs_empty_list(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    school, client = authorized_admin_client
    school_id = school.id

    res = client.get(f"/school/{school_id}/access-logs")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data["total_count"] == 0
    assert len(data["access_logs"]) == 0

# 27. get_all_access_logs_paginated

def test_get_all_access_logs_as_admin_paginated(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=klass.id)
    room = room_factory(school_id=school_id)


    access_time1 = datetime(year=2025, month=5, day=17, hour=10, minute=7)
    access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)

    search_start_date = "2025-05-15"
    search_end_date = "2025-05-18"

    access_log1 = access_logs_factory(
        access_start_time=access_time1.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )
    access_log2 = access_logs_factory(
        access_start_time=access_time2.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )

    res = client.get(f"/school/{school_id}/access-logs?start_date={search_start_date}&end_date={search_end_date}&limit=1")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data["total_count"] == 2
    assert data["has_next_page"] is True
    assert len(data["access_logs"]) == 1

def test_get_all_access_logs_as_admin_for_specific_room_id(
        authorized_admin_client,
        session,
        lesson_template_factory,
        lesson_instance_factory,
        room_factory,
        user_factory,
        classes_factory,
        access_logs_factory,
):
    school, client = authorized_admin_client
    school_id = school.id
    klass = classes_factory(school_id=school_id, class_name="4D")
    student = user_factory(role="student", school_id=school_id, email="student@example.com", class_id=klass.id)
    room = room_factory(school_id=school_id)
    room2 = room_factory(school_id=school_id)

    access_time1 = datetime(year=2025, month=5, day=17, hour=10, minute=7)
    access_time2 = datetime(year=2025, month=5, day=15, hour=10, minute=9)

    access_log1 = access_logs_factory(
        access_start_time=access_time1.isoformat(),
        room_id=room2.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )
    access_log2 = access_logs_factory(
        access_start_time=access_time2.isoformat(),
        room_id=room.id,
        user_id=student.user.id,
        access_status="denied",
        reason="Student currently do not have lesson in this classroom"
    )

    res = client.get(
        f"/school/{school_id}/access-logs?room_id={room.id}")
    data = res.json()
    print(data)
    assert res.status_code == 200
    assert data["total_count"] == 1
    assert data["has_next_page"] is False
    assert len(data["access_logs"]) == 1
# 28. get_all_access_logs_paginated_for_specific_room_id

# 29. get_attendance_after_successful_student_request_status_present
# 30. get_attendance_after_successful_student_request_status_absent
# 31. get_attendance_after_successful_student_request_status_late

# here will be also tests for websockets for:
#   - students request endpoint
#   - teacher approval endpoint