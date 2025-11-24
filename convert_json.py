import json
import os
from collections import OrderedDict

files = ["src/locales/en.json", "src/locales/zh.json", "src/locales/zh-TW.json"]


def deep_merge(target, source):
    for k, v in source.items():
        if k in target and isinstance(target[k], dict) and isinstance(v, dict):
            deep_merge(target[k], v)
        else:
            target[k] = v


def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    print(f"Processing {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        # Use OrderedDict to preserve order if possible, though we are restructuring
        data = json.load(f, object_pairs_hook=OrderedDict)

    new_data = OrderedDict()

    for key, value in data.items():
        if "." in key:
            parts = key.split(".")
            current_level = new_data
            for i, part in enumerate(parts[:-1]):
                if part not in current_level:
                    current_level[part] = OrderedDict()

                if not isinstance(current_level[part], dict):
                    # If we encounter a conflict where a key is a value, we can't easily fix it automatically without losing data or structure preference.
                    # But for this specific task, we expect "toolbar.x" and "toolbar.y", not "toolbar" and "toolbar.x".
                    print(f"Conflict: {part} is not a dict in {filepath} (key: {key})")
                    # Force it to be a dict? No, that would overwrite the previous value.
                    continue

                current_level = current_level[part]

            last_part = parts[-1]
            current_level[last_part] = value
        else:
            # Top level key without dots
            if key not in new_data:
                new_data[key] = value
            else:
                # Key exists (created by a dot-key previously)
                if isinstance(new_data[key], dict) and isinstance(value, dict):
                    deep_merge(new_data[key], value)
                else:
                    # If it's not a dict merge, we overwrite.
                    # This handles cases where we might have had implicit structure.
                    new_data[key] = value

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(new_data, f, indent=4, ensure_ascii=False)
    print(f"Finished {filepath}")


if __name__ == "__main__":
    for f in files:
        process_file(os.path.join(os.getcwd(), f))
