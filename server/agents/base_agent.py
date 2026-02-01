class BaseAgent:
    def __init__(self, config: dict):
        self.id = config["id"]
        self.role = config["role"]
        self.model = config["model"]
        self.temperature = config.get("temperature", 0.2)

    def run(self, task: dict):
        raise NotImplementedError
