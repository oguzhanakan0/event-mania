from django.urls import re_path

from .views import HomeView

urlpatterns = [
    # home
    re_path(r"^$", HomeView.as_view(), name="home"),
]
