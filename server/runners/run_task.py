import json
from pathlib import Path
from orchestrator.loader import load_yaml
from orchestrator.orchestrator import Orchestrator

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "outputs"
OUTPUT_DIR.mkdir(exist_ok=True)


def main():
    agents = load_yaml("agents.yaml")["agents"]
    tasks = load_yaml("tasks.yaml")["tasks"]
    tools = load_yaml("tools.yaml")["tools"]
    evaluation = load_yaml("evaluation.yaml")["evaluation"]

    agent_config = agents[0]

    orchestrator = Orchestrator(agent_config, tools, evaluation)

    for task in tasks:
        result = orchestrator.run(task)

        output_file = OUTPUT_DIR / f"{task['id']}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2)

        print(f"Completed {task['id']} → Score:", result["evaluation"]["score"])


if __name__ == "__main__":
    main()
