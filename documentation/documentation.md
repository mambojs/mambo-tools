# Table of Contents

- [APIManager](#apimanager-documentation)
- [DateManager](#datemanager-documentation)
- [EventManager](#eventmanager-documentation)
- [HistoryManager](#historymanager-documentation)
- [ObjectManager](#objectmanager-documentation)
- [RouterManager](#routermanager-documentation)
- [String](#string-documentation)
- [Utilities](#utilities-documentation)

# APIManager Documentation

A client-side API manager for handling HTTP requests with support for caching, progress tracking, and various response formats.

## Public Properties (m_props)

### timeout
- **Type**: Number
- **Default**: `5000`
- **Description**: Maximum time in milliseconds to wait for a request to complete before aborting.

## Private Properties

### m_config
- **Type**: Object
- **Description**: Stores configuration settings
- **Properties**:
  - `timeout` (Number): Request timeout in milliseconds

### m_eventListener
- **Type**: HTMLElement
- **Description**: DOM element used for handling API events

### m_cached
- **Type**: Object
- **Description**: Cache storage for API responses
- **Structure**: 
  ```javascript
  {
    [url]: {
      [cacheKey]: responseData
    }
  }
  ```

## Public Methods

### delete(url, custom)
Performs HTTP DELETE request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options

### get(url, custom)
Performs HTTP GET request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options

### getCache()
Returns the current cache storage
- **Returns**: Object containing all cached responses

### getFile(url, custom)
Retrieves a file as blob
- **Parameters**:
  - `url` (String): File URL
  - `custom` (Object, optional): Custom request options

### getFileContent(url, custom)
Retrieves file content as text
- **Parameters**:
  - `url` (String): File URL
  - `custom` (Object, optional): Custom request options

### getJSON(url, custom)
Retrieves and parses JSON data
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options including format ('string', 'pretty')

### getXML(url, custom)
Retrieves and parses XML data
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options including format ('string', 'xml')

### head(url, custom)
Performs HTTP HEAD request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options

### patch(url, custom)
Performs HTTP PATCH request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options with body

### post(url, custom)
Performs HTTP POST request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options with body

### postJSON(url, custom)
Performs HTTP POST request with JSON data
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options with JSON body

### put(url, custom)
Performs HTTP PUT request
- **Parameters**:
  - `url` (String): Request URL
  - `custom` (Object, optional): Custom request options with body

## Private Methods

### processResponse(response, custom, type, cacheKey)
Processes API response based on type and caching requirements
- **Parameters**:
  - `response` (Response): Fetch response object
  - `custom` (Object): Custom options
  - `type` (String): Response type ('json', 'blob', 'text', 'xml')
  - `cacheKey` (String): Cache identifier

### execRequest(url, options, key)
Executes the fetch request with configuration
- **Parameters**:
  - `url` (String): Request URL
  - `options` (Object): Fetch options
  - `key` (String): Cache key

### progressProcess(response, url, cacheKey)
Handles request progress tracking
- **Parameters**:
  - `response` (Response): Fetch response
  - `url` (String): Request URL
  - `cacheKey` (String): Cache identifier

### prepareEvents(options)
Sets up event listeners for request lifecycle
- **Parameter**: `options` (Object): Request options with events

### getEvents()
Creates event handler object for API events
- **Returns**: Object with event handlers for error, load, loadstart, and progress

### cacheKey(url, options)
Generates unique cache key
- **Parameters**:
  - `url` (String): Request URL
  - `options` (Object): Request options

### cacheSave(custom, cacheKey, finalResponse)
Saves response to cache
- **Parameters**:
  - `custom` (Object): Custom options
  - `cacheKey` (String): Cache identifier
  - `finalResponse` (Any): Response data to cache

### configure()
Initializes configuration with defaults and custom options

# DateManager Documentation

A utility class for handling date operations, formatting, and manipulations.

## Private Properties

### m_formatTokens
- **Type**: RegExp
- **Description**: Regular expression for parsing date format tokens

### weekdays
- **Type**: Array
- **Description**: List of weekday names in English
- **Values**: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

### monthNames
- **Type**: Array
- **Description**: List of month names in English
- **Values**: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

## Public Methods

### add(date, number, token)
Adds time to a date
- **Parameters**:
  - `date` (Date): Date to modify
  - `number` (Number): Amount to add
  - `token` (String): Unit of time ('minutes'/'m', 'hours'/'h', 'days'/'d', 'months'/'M', 'years'/'Y')
- **Returns**: DateManager instance for chaining

### cloneDate(date)
Creates a copy of a date object
- **Parameter**: `date` (Date)
- **Returns**: New Date object

### createDate(text, formatText)
Creates a date from a string using specified format
- **Parameters**:
  - `text` (String): Date string to parse
  - `formatText` (String): Format pattern
- **Returns**: Date object or null if invalid

### createInterval(interval, token, min, max, formatText)
Creates an array of dates between min and max
- **Parameters**:
  - `interval` (Number): Time interval
  - `token` (String): Unit of time
  - `min` (Date): Start date
  - `max` (Date): End date
  - `formatText` (String, optional): Format for output dates
- **Returns**: Array of dates or formatted strings

### endOf(date, token)
Sets date to end of period
- **Parameters**:
  - `date` (Date): Date to modify
  - `token` (String): Period ('month'/'M', 'year'/'Y', 'decade', 'century')
- **Returns**: DateManager instance

### format(date, formatText)
Formats a date according to specified pattern
- **Parameters**:
  - `date` (Date): Date to format
  - `formatText` (String): Format pattern
- **Returns**: Formatted date string

### getDate(value, formatText)
Converts value to date object
- **Parameters**:
  - `value` (Date|String): Value to convert
  - `formatText` (String): Format pattern if value is string
- **Returns**: Date object

### getDayName(day)
Gets name of weekday
- **Parameter**: `day` (Number): Day index (0-6)
- **Returns**: Weekday name

### getToday()
Gets current date at midnight
- **Returns**: Date object

### isAfter(date1, date2)
Checks if date1 is after date2
- **Returns**: Boolean

### isSameOrAfter(date1, date2)
Checks if date1 is same as or after date2
- **Returns**: Boolean

### isBefore(date1, date2)
Checks if date1 is before date2
- **Returns**: Boolean

### isSame(date1, date2)
Checks if dates are same
- **Returns**: Boolean

### isSameOrBefore(date1, date2)
Checks if date1 is same as or before date2
- **Returns**: Boolean

### isDate(value)
Checks if value is Date object
- **Returns**: Boolean

### startOf(date, token)
Sets date to start of period
- **Parameters**:
  - `date` (Date): Date to modify
  - `token` (String): Period ('week'/'w', 'month'/'M', 'year'/'Y', 'decade', 'century')
- **Returns**: DateManager instance

## Private Methods

### getHours(date, is12Format)
Gets hours in 12 or 24-hour format
- **Parameters**:
  - `date` (Date): Date object
  - `is12Format` (Boolean): Whether to use 12-hour format
- **Returns**: Number

### getAMPM(date)
Gets AM/PM indicator
- **Parameter**: `date` (Date)
- **Returns**: 'am' or 'pm'

### getMonthName(month)
Gets name of month
- **Parameter**: `month` (Number): Month index (0-11)
- **Returns**: Month name

### addZero(value, n)
Pads number with leading zeros
- **Parameters**:
  - `value` (Number): Number to pad
  - `n` (Number): Desired length
- **Returns**: Padded string

### isString(value)
Checks if value is string
- **Returns**: Boolean

### isNumber(value)
Checks if value is number
- **Returns**: Boolean



# EventManager Documentation

A simple event management system that allows components to communicate through custom events.

## Private Properties

### m_eventDirectory
- **Type**: MamboEventDirectory
- **Description**: Instance containing all available event names

### m_events
- **Type**: Object
- **Description**: Reference to available events from m_eventDirectory
- **Structure**:
  ```javascript
  {
    eventName: "eventName"
  }
  ```

### m_listeners
- **Type**: Object
- **Description**: Storage for event listeners
- **Structure**:
  ```javascript
  {
    [eventName]: {
      [listenerName]: callbackFunction
    }
  }
  ```

## Public Methods

### addEventListener(listener, event, fn)
Registers a new event listener
- **Parameters**:
  - `listener` (String): Unique identifier for the listener
  - `event` (String): Event name to listen for
  - `fn` (Function): Callback function to execute when event fires
- **Validation**:
  - Checks if event exists
  - Ensures unique listener names
  - Validates callback is a function

### fireEvent(event, data)
Triggers an event and notifies all listeners
- **Parameters**:
  - `event` (String): Event name to trigger
  - `data` (Any): Data to pass to event listeners

### removeEventListener(listener, event)
Removes a specific event listener
- **Parameters**:
  - `listener` (String): Listener identifier to remove
  - `event` (String): Event name to remove listener from

## Private Methods

### initializeListeners()
Initializes the listeners object with empty collections for each available event

## MamboEventDirectory Class

### events
- **Type**: Object
- **Description**: Registry of all available events
- **Current Events**:
  - `testEvent`: "testEvent"



# HistoryManager Documentation

A wrapper for browser history management that provides methods for navigation and state manipulation.

## Private Properties

### popstate
- **Type**: Event
- **Description**: Custom event for history state changes

### locationchange
- **Type**: Event
- **Description**: Custom event for location changes

## Public Methods

### back()
Navigates to previous state in history
- **Description**: Wrapper for `history.back()`

### clearState(state, title)
Clears history state and resets to root path
- **Parameters**:
  - `state` (Object): State object to store
  - `title` (String): Page title to set

### forward()
Navigates to next state in history
- **Description**: Wrapper for `history.forward()`

### go(args)
Navigates to specific point in history
- **Parameter**: `args` (Number): Number of steps to move (positive or negative)

### pushState(state, title, path)
Adds new state to history
- **Parameters**:
  - `state` (Object): State object to store
  - `title` (String): Page title to set
  - `path` (String): URL path to push

### replaceState(state, title, path)
Replaces current history state
- **Parameters**:
  - `state` (Object): State object to store
  - `title` (String): Page title to set
  - `path` (String): URL path to set

## Private Methods

### setPageTitle(title)
Updates document title
- **Parameter**: `title` (String): New page title

### setupEventHandler()
Initializes event listeners for history changes
- **Description**: Sets up popstate and locationchange event handling

### checkHistory()
Verifies history state on initialization
- **Description**: Ensures valid initial state exists, creates one if needed



# ObjectManager Documentation

A simple object storage manager that provides a central repository for storing and retrieving objects.

## Private Properties

### store
- **Type**: Object
- **Description**: Internal storage object that holds all saved objects
- **Structure**:
  ```javascript
  {
    [objectName]: storedObject
  }
  ```

## Public Methods

### get(name)
Retrieves an object from storage
- **Parameter**: `name` (String): Name of object to retrieve
- **Returns**: Stored object or undefined if not found

### save(object, name)
Stores an object in the library
- **Parameters**:
  - `object` (Any): Object to store
  - `name` (String, optional): Custom name for the object
    - If name not provided, uses object's constructor name
- **Description**: Stores object with either provided name or object's constructor name as key

### remove(name)
Removes an object from storage
- **Parameter**: `name` (String): Name of object to remove
- **Returns**: Boolean indicating if deletion was successful

### getLibrary()
Returns entire storage object
- **Returns**: Object containing all stored objects

### clearLibrary()
Resets the storage to empty state
- **Description**: Replaces store with empty object

## Private Methods

### saveObject(object, name)
Internal implementation of save method
- **Parameters**:
  - `object` (Any): Object to store
  - `name` (String, optional): Custom name for storage
- **Description**: Determines storage key and saves object to store

# RouterManager Documentation

A client-side router manager for handling navigation and route management in web applications.

## Public Properties (m_props)

### basePath
- **Type**: Array
- **Default**: `[]`
- **Description**: List of base paths that will be prepended to all routes. Useful for applications that don't run at the root domain.

### baseStrict
- **Type**: Boolean
- **Default**: `false`
- **Description**: When true, routes will only work with the defined basePath. When false, routes will work both with and without the basePath.

### events
- **Type**: Function
- **Default**: `() => {}`
- **Description**: Callback function to set up router events. Receives an event object with router lifecycle hooks.

## Private Properties

### current
- **Type**: Object
- **Description**: Stores information about the current route state
- **Properties**:
  - `name` (String): Name of the current route
  - `path` (String): Current URL path
  - `from` (Object): Information about the previous route
  - `to` (Object): Information about the target route
  - `params` (Object): Route parameters
  - `query` (String): URL query string

### historyManager
- **Type**: Object
- **Description**: Instance that manages browser history operations

### m_routesList
- **Type**: Array
- **Description**: Internal storage of all registered routes

### m_eventListener
- **Type**: HTMLElement
- **Description**: DOM element used for handling router events

### m_routerEvents
- **Type**: Array
- **Description**: List of available router events and their usage status

### m_lastRoute
- **Type**: Object
- **Description**: Stores information about the previous route

### m_newMatchedObject
- **Type**: Object
- **Description**: Temporary storage for newly matched route information

## Public Methods

### add(routes)
Adds new routes to the router configuration
- **Parameter**: `routes` (Array)
- **Route Object Properties**:
  - `path` (String, required): URL path for the route
  - `name` (String, required): Unique identifier for the route
  - `alias` (String, optional): Alternative path for the same route
  - `notfound` (Boolean, optional): Indicates if this is a 404 route

### back()
Navigates to the previous route in browser history

### go(steps)
Navigates forward or backward in browser history
- **Parameter**: `steps` (Number) - Positive numbers move forward, negative numbers move backward

### next()
Navigates to the next route in browser history

### push(routeObject, dispatch)
Navigates to a new route and adds it to history
- **Parameters**:
  - `routeObject` (Object):
    - `path` (String): URL path
    - `name` (String, optional): Route name
    - `params` (Object, optional): Route parameters
    - `query` (String, optional): Query string
    - `hash` (String, optional): URL hash
  - `dispatch` (Boolean, default: true): Whether to trigger route events

### replace(routeObject)
Replaces current route without adding to history
- **Parameter**: `routeObject` (Object) - Same structure as push() routeObject

### routes(routes)
Gets or sets the router configuration
- **Parameter**: `routes` (Array, optional) - List of route objects
- **Returns**: Current routes array when called without parameters

### init()
Initializes the router with current browser location

## Private Methods

### checkBasePath(path)
Validates and prepends base paths to a route path
- **Parameter**: `path` (String) - Route path to process
- **Returns**: String or Array of paths including base paths

### checkRoutesFormat(routes)
Validates that all routes have the required format
- **Parameter**: `routes` (Array) - List of route objects to validate
- **Returns**: Boolean indicating if format is valid

### checkRoutesDuplicated(routes)
Checks for duplicate route names or paths
- **Parameter**: `routes` (Array) - List of routes to check
- **Returns**: Boolean indicating if duplicates were found

### isCurrentRoute(routeObject)
Determines if a route matches the current route
- **Parameter**: `routeObject` (Object) - Route to check
- **Returns**: Boolean

### matchedRouteBy(options)
Finds a matching route based on path or name
- **Parameter**: `options` (Object):
  - `path` (String, optional): Route path to match
  - `name` (String, optional): Route name to match
- **Returns**: Object with matching information

### setRoute()
Updates route state after navigation and executes route actions

### updateCurrent(currentRouteObject, recycle)
Updates the current route information
- **Parameters**:
  - `currentRouteObject` (Object): New route information
  - `recycle` (Boolean): Whether to reset current object

### prepareEvents()
Initializes router event listeners and sets up event handling

### execDispatch(event, currentObject, newMatchedObject, path)
Dispatches router events to listeners
- **Parameters**:
  - `event` (String): Event name to dispatch
  - `currentObject` (Object): Current route state
  - `newMatchedObject` (Object): New route state
  - `path` (String): New route path



# String Documentation

A utility class for string operations and array text searching.

## Public Methods

### filterArray(array, searchText, getItemTextFunc, filter)
Filters an array based on text search criteria
- **Parameters**:
  - `array` (Array): Array to filter
  - `searchText` (String): Text to search for
  - `getItemTextFunc` (Function): Function to extract text from array items
  - `filter` (String): Search type ('contains' or 'equals')
- **Returns**: Filtered array

### findInArray(array, searchText, getItemTextFunc, filter)
Finds first array item matching search criteria
- **Parameters**:
  - `array` (Array): Array to search
  - `searchText` (String): Text to search for
  - `getItemTextFunc` (Function): Function to extract text from array items
  - `filter` (String): Search type ('contains' or 'equals')
- **Returns**: Matching item or undefined

### getSearchFunction(filter)
Gets appropriate search function based on filter type
- **Parameter**: `filter` (String): Search type ('contains' or 'equals')
- **Returns**: Search function

## Private Methods

### contains(itemText, searchText)
Checks if item text contains search text (case-insensitive)
- **Parameters**:
  - `itemText` (String): Text to search in
  - `searchText` (String): Text to search for
- **Returns**: Boolean

### equals(itemText, searchText)
Checks if item text equals search text (case-insensitive)
- **Parameters**:
  - `itemText` (String): Text to compare
  - `searchText` (String): Text to compare against
- **Returns**: Boolean

# Utilities Documentation

A collection of utility functions for common operations.

## Public Methods

### clone(object)
Creates a deep copy of an object
- **Parameter**: `object` (Object): Object to clone
- **Returns**: New object copy

### extend()
Merges multiple objects
- **Parameters**:
  - First argument can be boolean for deep merge
  - Subsequent arguments are objects to merge
- **Returns**: Merged object

### formatPercentage(number, decimals)
Formats a number as percentage string
- **Parameters**:
  - `number` (Number): Number to format
  - `decimals` (Number, default: 0): Decimal places
- **Returns**: Formatted percentage string

### getUniqueId(num)
Generates random numeric ID
- **Parameter**: `num` (Number, default: 100000): Maximum value
- **Returns**: Random number

### isArray(value)
Checks if value is array
- **Returns**: Boolean

### isNumber(value)
Checks if value is valid number
- **Returns**: Boolean

### isObject(value)
Checks if value is object
- **Returns**: Boolean

### isString(value)
Checks if value is string
- **Returns**: Boolean

## Private Methods

### merge(obj)
Internal method for object merging
- **Parameter**: `obj` (Object): Object to merge

### mergeArray(array, extended, prop)
Internal method for array merging
- **Parameters**:
  - `array` (Array): Array to merge
  - `extended` (Object): Target object
  - `prop` (String): Property name
