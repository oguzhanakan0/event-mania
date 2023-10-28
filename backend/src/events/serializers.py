from rest_framework import serializers
from .models import Event
from django.contrib.auth.models import User


class EventSerializer(serializers.ModelSerializer):
    """
    Event serializer consumed by api.views functions.
    Additional fields:
        - created_by: only returns the username of the creator instead of the whole object
        - user_count: returns the number of users attending to the event
        - attending: true if the requester is attending to the event
        - is_creator: true if the requester created the event
    """

    created_by = serializers.CharField(source="created_by.username")
    user_count = serializers.IntegerField()
    attending = serializers.SerializerMethodField()
    is_creator = serializers.SerializerMethodField()

    def get_attending(self, obj):
        request = self.context.get("request")
        return obj.users.filter(id=request.user.id).exists()

    def get_is_creator(self, obj):
        request = self.context.get("request")
        return obj.created_by == request.user

    class Meta:
        model = Event
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "last_login",
        ]
