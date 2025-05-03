class ExecutionContext:
    def __init__(self, task, agent, tools):
        self.task = task
        self.agent = agent
        self.tools = tools
        self.response = None
        self.evaluation = None
