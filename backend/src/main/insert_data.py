import random
from lorem_text import lorem
from django.contrib.auth.models import User
from events.models import Event
from django.utils import timezone
import pytz

print("Inserting random users and event data..")

N_EVENTS = 100
_users = [
    {
        "first_name": "Lily",
        "last_name": "Navarro",
        "email": "lily.navarro@gmail.com",
        "username": "lily.navarro",
    },
    {
        "first_name": "Brendan",
        "last_name": "Combs",
        "email": "brendan.combs@gmail.com",
        "username": "brendan.combs",
    },
    {
        "first_name": "Conner",
        "last_name": "Marquez",
        "email": "conner.marquez@gmail.com",
        "username": "conner.marquez",
    },
    {
        "first_name": "Rosie",
        "last_name": "OConnor",
        "email": "rosie.oconnor@gmail.com",
        "username": "rosie.oconnor",
    },
    {
        "first_name": "Jonathan",
        "last_name": "Meadows",
        "email": "jonathan.meadows@gmail.com",
        "username": "jonathan.meadows",
    },
    {
        "first_name": "Jose",
        "last_name": "Burgess",
        "email": "jose.burgess@gmail.com",
        "username": "jose.burgess",
    },
    {
        "first_name": "Jerry",
        "last_name": "Frost",
        "email": "jerry.frost@gmail.com",
        "username": "jerry.frost",
    },
    {
        "first_name": "Eddie",
        "last_name": "Carey",
        "email": "eddie.carey@gmail.com",
        "username": "eddie.carey",
    },
    {
        "first_name": "Umair",
        "last_name": "Rojas",
        "email": "umair.rojas@gmail.com",
        "username": "umair.rojas",
    },
    {
        "first_name": "Sally",
        "last_name": "Nguyen",
        "email": "sally.nguyen@gmail.com",
        "username": "sally.nguyen",
    },
]

users = []
for _user in _users:
    try:
        User.objects.get(username=_user["username"]).delete()
    except:
        pass
    user = User.objects.create(**_user)
    users.append(user)

for i in range(N_EVENTS):
    user = random.choice(users)
    event = Event.objects.create(
        created_by=user,
        title=lorem.words(random.randint(3, 6)).title(),
        description=lorem.paragraphs(random.randint(1, 4)),
        date=timezone.datetime(2023, 10, random.randint(1, 30), tzinfo=pytz.UTC),
    )
    event.users.set(random.choices(users, k=random.randint(1, 8)))

print(f"Inserted {len(users)} users and {N_EVENTS} events.")
