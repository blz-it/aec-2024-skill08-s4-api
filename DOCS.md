# Session 4 API Documentation

This is the API documentation for the AEC 2024 Skill 08 Session 4 API.

## Events

The API provides an endpoint to subscribe to events.

### Subscribe to an Event

This endpoint uses HTTP Long Polling, meaning the connection will remain open until an event is available. Clients should make a request to this endpoint and wait for a response. Once a response is received, the client should immediately make another request to continue receiving events.

!!! note

    For the initial request, it is possible to pass the query parameter `wait=false` to get the current event immediately.

```
GET /events/:id/subscribe
```

Example Response

```json
{
  "action": {
    "type": "flashlight"
  }
}
```
