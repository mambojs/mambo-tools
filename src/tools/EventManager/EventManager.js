tools.class.EventManager = function EventManager() {
	const m_eventDirectory = new MamboEventDirectory();
	const m_events = m_eventDirectory.events;
	const m_listeners = {};

	this.addEventListener = addEventListener;
	this.fireEvent = fireEvent;
	this.removeEventListener = removeEventListener;

	initializeListeners();

	function addEventListener(listener, event, fn) {
		if (event in m_listeners) {
			if (typeof fn === "function") {
				if (m_listeners[event][listener]) {
					alert(`ScEvents: event listener "${listener}" already exists. Please provide a listener with a unique name.`);
				} else {
					m_listeners[event][listener] = fn;
				}
			} else {
				alert(`ScEvents: event listener "${listener}" didn't provide a valid function type as a call back.`);
			}
		} else {
			alert(`ScEvents: event "${event}" does not exist. Please check available events in component ScEventsLibrary.`);
		}
	}

	function fireEvent(event, data) {
		if (event && data) {
			const ev = m_listeners[event];
			if (ev) {
				for (const key in ev) {
					if (key in ev) {
						ev[key](data);
					}
				}
			}
		}
	}

	function removeEventListener(listener, event) {
		if (listener && event) {
			delete m_listeners[event][listener];
		}
	}

	function initializeListeners() {
		for (const event in m_events) {
			if (event in m_events) {
				m_listeners[event] = {};
			}
		}
	}
};

tools.event = (props) => new tools.class.EventManager(props);

function MamboEventDirectory() {
	// Include events in this object
	this.events = {
		testEvent: "testEvent",
	};
}
