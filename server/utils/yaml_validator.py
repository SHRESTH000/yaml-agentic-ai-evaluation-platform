def validate_yaml(data: dict, required_keys: list):
    for key in required_keys:
        if key not in data:
            raise ValueError(f"Missing required key: {key}")
