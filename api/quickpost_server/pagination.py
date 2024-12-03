from rest_framework.pagination import CursorPagination

class FeedCursorPagination(CursorPagination):
    page_size = 6
    ordering = '-created_at'