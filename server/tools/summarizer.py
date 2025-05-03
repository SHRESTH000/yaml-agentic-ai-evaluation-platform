from tools.base_tool import BaseTool


class SummarizerTool(BaseTool):
    name = "summarizer"

    def execute(self, text: str) -> str:
        return text[:150] + "..."
