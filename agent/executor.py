class ToolExecutor:
    def __init__(self, tool_registry: dict):
        self.tool_registry = tool_registry

    def execute(self, tool_name: str, **kwargs):
        if tool_name not in self.tool_registry:
            raise ValueError(f"Tool '{tool_name}' not found")

        return self.tool_registry[tool_name](**kwargs)
