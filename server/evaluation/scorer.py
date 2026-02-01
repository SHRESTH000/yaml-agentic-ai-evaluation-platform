from evaluation.intent_matcher import intent_matches
from evaluation.constraint_checker import violates_constraints


def score_response(task: dict, response: str, eval_config: dict) -> dict:
    score = 0.0

    if intent_matches(task["expected_intent"], response):
        score += eval_config["weights"].get("intent_match", 1)

    if violates_constraints(task, response):
        score -= eval_config["weights"].get("constraint_violation", 1)

    return {
        "score": score,
        "intent_match": score > 0
    }
