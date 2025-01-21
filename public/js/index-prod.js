const tools = mamboTools();
const object = tools.object();

// Instantiate global Object Manager and required Object instances
object.save(tools.utils(), "utils");
object.save(tools.string(), "string");
object.save(tools.history(), "history");
object.save(tools.router({ historyManager: object.get("history") }), "router");
object.save(tools.api(), "api");
object.save(mamboUI(domJS), "ui");
object.save(domJS(), "dom");
installStoryboard();
