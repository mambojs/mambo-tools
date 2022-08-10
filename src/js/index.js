// Instantiate global Object Manager and required Object instances
const object = tools.object();
object.save(tools.utils(), "utils");
object.save(tools.string(), "string");
object.save(tools.history(), "history");
object.save(tools.router({ historyManager: object.get("history") }), "router");
object.save(tools.api(), "api");
object.save(mamboUI(), "ui");
object.save(domJS(), "dom");

// Begin Storyboard development installation
installStoryboard();
