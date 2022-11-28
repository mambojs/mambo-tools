// Instantiate global Object Manager and required Object instances
const object = tools.object();
object.save(tools.utils(), "utils");
object.save(tools.string(), "string");
object.save(tools.router(), "router");
object.save(tools.api(), "api");
object.save(mamboUI(domJS), "ui");
object.save(domJS(), "dom");

// Begin Storyboard development installation
installStoryboard();
