from tools.base_tool import BaseTool


class PriorityClassifierTool(BaseTool):
    name = "priority_classifier"

    def execute(self, text: str) -> str:
        return "high"
