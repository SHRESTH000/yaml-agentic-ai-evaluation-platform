def violates_constraints(task: dict, response: str) -> bool:
    constraints = task.get("constraints", [])
    for rule in constraints:
        if "travel" in rule.lower() and "travel" in response.lower():
            return True
    return False
