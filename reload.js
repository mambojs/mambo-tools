if (location.host === `localhost:8001`) {
    (() => new EventSource(`http://localhost:8008`).onmessage = () => location.reload())();
}
