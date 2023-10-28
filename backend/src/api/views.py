import json
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    ListAPIView,
)
from django.contrib.auth import authenticate, login, logout
from events.models import Event
from events.serializers import EventSerializer, UserSerializer
from django.utils import timezone
from rest_framework.filters import SearchFilter
from django.db.models import Q
from django.contrib.auth.models import User


class SignIn(ObtainAuthToken):
    """
    Signs in the user and sets auth_token cookie.
    """

    permission_classes = []
    authentication_classes = []

    def post(self, request):
        d = json.loads(request.body)
        _user = User.objects.get(email=d.get("email"))
        user = authenticate(username=_user.username, password=d.get("password"))
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            response = Response()
            response.set_cookie("auth_token", token.key)
            response["Access-Control-Allow-Credentials"] = "true"
            return response
        else:
            return Response(status=401)


class SignOut(APIView):
    """
    Signs out the user and deletes auth_token and csrftoken tokens.
    """

    permission_classes = []
    authentication_classes = []

    def get(self, request):
        logout(request)
        response = Response(headers={"Access-Control-Allow-Credentials": "true"})
        response.delete_cookie("auth_token")
        response.delete_cookie("csrftoken")
        response["Access-Control-Allow-Credentials"] = "true"
        return response


class UpdateUser(APIView):
    """
    Updates user information with the request body.
    There is a manual email address check as default Django User does not enforce uniqueness in db level.
    """

    def patch(self, request):
        d = json.loads(request.body)
        user = User.objects.filter(pk=request.user.id)
        if (
            User.objects.filter(email=d["email"]).exists()
            and request.user.email != d["email"]
        ):
            return Response(status=409)
        if user[0] == request.user:
            user.update(**d)
            return Response("ok")
        return Response(status=403)


class ChangePassword(APIView):
    """
    Changes password upon successful providing of old password.
    """

    def post(self, request):
        d = json.loads(request.body)
        user = request.user
        if user.check_password(d.get("old_password")):
            user.set_password(d.get("new_password"))
            user.save()
            return Response("ok")
        return Response(status=401)


class CreateEvent(CreateAPIView):
    """
    Creates an event with given request body. Adds the creator as an attendee as well.
    """

    def post(self, request):
        d = json.loads(request.body)
        d["created_by"] = request.user
        event = Event.objects.create(**d)
        event.users.add(request.user)
        serializer = EventSerializer(event)
        serializer.context.update({"request": self.request})
        return Response(serializer.data)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class CreateUser(CreateAPIView):
    """
    Creates a user with given request body. If exists, throws a 409 (Conflict) error.
    """

    permission_classes = []
    authentication_classes = []

    def post(self, request):
        d = json.loads(request.body)
        if not User.objects.filter(email=d["email"]).exists():
            user = User.objects.create(**d)
            user.set_password(d["password"])
            user.save()
            return Response("ok")
        return Response(status=409)


class GetEvent(RetrieveAPIView):
    """
    Retrieves an event.
    """

    serializer_class = EventSerializer
    queryset = Event.objects.all()


class GetEvents(ListAPIView):
    """
    Retrieves multiple events.
    """

    serializer_class = EventSerializer
    queryset = Event.objects.filter(date__gte=timezone.now())
    filter_backends = [SearchFilter]
    search_fields = ["title", "description"]


class GetEventsHome(ListAPIView):
    """
    Retrieves events for Home page view. This is different than :api.views.GetEvents: because it
    filters out the events that the user did not create and not attending.
    """

    serializer_class = EventSerializer

    def get_queryset(self):
        user_events = self.request.user.event_set.filter(date__gte=timezone.now())
        queryset = Event.objects.filter(
            ~Q(created_by=self.request.user),
            ~Q(users__in=[self.request.user]),
            date__gte=timezone.now(),
        )[:3]
        return queryset


class GetMyEvents(ListAPIView):
    """
    Retrieves events that the requester is attending to.
    """

    serializer_class = EventSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = self.request.user.event_set.filter(date__gte=timezone.now())
        return queryset


class GetOwningEvents(ListAPIView):
    """
    Retrieves events created by requester.
    """

    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.filter(
            date__gte=timezone.now(), created_by=self.request.user
        )
        return queryset


class UpdateEvent(APIView):
    """
    Provides an update and a delete function to update an event based on the request body,
    or destroy it.
    """

    def patch(self, request):
        d = json.loads(request.body)
        event = Event.objects.filter(pk=d.get("pk"))
        del d["pk"]
        if event[0].created_by == request.user:
            event.update(**d)
            return Response("ok")
        return Response(status=403)

    def delete(self, request):
        d = json.loads(request.body)
        event = Event.objects.filter(pk=d.get("pk"))
        if event[0].created_by == request.user:
            event.delete()
            return Response("ok")
        return Response(status=403)


class JoinEvent(APIView):
    """
    Adds the user to attendee list for an event
    """

    def post(self, request):
        d = json.loads(request.body)
        event = Event.objects.get(pk=d.get("pk"))
        if event.users.filter(id=request.user.id).exists():
            return Response(status=409)
        event.users.add(request.user)
        return Response("ok")


class WithdrawFromEvent(APIView):
    """
    Removes the user from the attendee list of an event.
    """

    def post(self, request):
        d = json.loads(request.body)
        event = Event.objects.get(pk=d.get("pk"))
        event.users.remove(request.user)
        print(f"removed {request.user}, current users:{event.users.all()}")
        return Response("ok")


class GetProfile(APIView):
    """
    Returns user information.
    """

    def get(self, request):
        return Response(UserSerializer(request.user).data)
