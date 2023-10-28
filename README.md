# EventMania🎈
Welcome to EventMania, a simple app for setting up, exploring, and managing events.

## Features
### 1. Authentication
Users sign up and sign in to the app with their email addresses. On sign in, an auth_token is provided to the user which will be used in subsequent API calls. The `email` and `username` properties are unique.

### 2. Home (Dashboard)
Home page provides three pillars of events:
- Up Next: Shows closest 3 upcoming events that the user is signed up for.
- Events Created by You: Shows closest 3 upcoming events that the user created.
- Explore Events: Shows closest 3 upcoming events that the user is not the creator and also not signed up.
Every `EventCard` has buttons to go to details page. The user can also join to events directly from this card.

### 3. Calendar
Shows a tiled list of `EventCard`s that's in the user's schedule (similar to the section in Home, but full list)

### 4. Events
A tiled `EventCard` list that shows all upcoming events with lazy loading. Loads more events as the user scrolls.

#### Search
Search is done across event title and description. Matching records will be filtered. Lazy loading still works if there are more events than the page size.

### 5. Profile
Two-tab view that displays user information and events created by the user. The user is able to modify their information, change password, and sign out.

### 6. Theme
Dark mode can be activated by turning the switch located on bottom-left corner of the page.

# Run the App

## Prerequisits

- install docker and docker compose

## Backend

### Installation and Run

- to run the backend server:
  ```
  cd backend
  docker compose build
  docker compose up
  ```
  

## Frontend

### Installation and Run

- to run the frontend server:
  ```
  cd frontend
  docker compose build
  docker compose up
  ```

Finally, navigate to http://localhost:3000

## Future Work
- Tests for API views to be written.
- Frontend functions can be moved to `components/util.tsx` for reducing duplications.
- More types should be put into `components/types.tsx` to ensure type checking in all objects.
- Inline styles could be moved out to different source file or the `global.css` can be changed when relevant.
- Email confirmation was planned to be done through Gmail auth tokens, but Google deprecated App Passwords in 2022. New auth schema is done through OAuth2.0, which is accomplished by integrating google-auth package. *I thought it'd be a little overkill for this stage.*
