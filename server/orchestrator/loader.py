import yaml
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
YAML_DIR = BASE_DIR / "yaml_configs"


def load_yaml(file_name: str) -> dict:
    with open(YAML_DIR / file_name, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)
