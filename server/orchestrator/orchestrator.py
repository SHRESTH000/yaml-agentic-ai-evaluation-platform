from agents.intent_agent import IntentAgent
from evaluation.scorer import score_response
from orchestrator.context import ExecutionContext


class Orchestrator:
    def __init__(self, agent_config, tools_config, eval_config):
        self.agent = IntentAgent(agent_config)
        self.tools = tools_config
        self.eval_config = eval_config

    def run(self, task: dict) -> dict:
        context = ExecutionContext(task, self.agent, self.tools)

        response = self.agent.run(task)
        context.response = response

        evaluation = score_response(task, response, self.eval_config)
        context.evaluation = evaluation

        return {
            "task_id": task["id"],
            "response": response,
            "evaluation": evaluation
        }
