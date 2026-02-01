def intent_matches(expected: dict, response: str) -> bool:
    response = response.lower()

    intent_keywords = {
        "email_prioritization": [
            "prioritize",
            "priority",
            "important emails",
            "organize",
            "filters",
            "folders",
            "inbox management"
        ]
    }

    primary = expected.get("primary")
    if not primary:
        return False

    keywords = intent_keywords.get(primary, [])

    return any(keyword in response for keyword in keywords)
