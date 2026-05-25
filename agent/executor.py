class ToolExecutor:
    def __init__(self, tool_registry: dict):
        self.tool_registry = tool_registry

    async def execute(self, tool_name: str, **kwargs):
        if tool_name not in self.tool_registry:
            raise ValueError(f"Tool '{tool_name}' not found")

        # The tool function is now expected to be an async generator
        tool_function = self.tool_registry[tool_name]
        
        # We await the call, which returns the async generator/stream
        return tool_function(tool_name, **kwargs)
