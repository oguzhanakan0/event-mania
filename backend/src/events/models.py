from django.db import models
from django.contrib.auth.models import User
import uuid


class Event(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    title = models.CharField(max_length=120)
    description = models.TextField(max_length=280)
    date = models.DateTimeField()
    date_added = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField(User)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="events_created",
        to_field="username",
    )

    @property
    def user_count(self):
        return self.users.count()

    class Meta:
        ordering = ["date"]
