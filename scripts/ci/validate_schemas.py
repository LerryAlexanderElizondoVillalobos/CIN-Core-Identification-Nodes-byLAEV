#!/usr/bin/env python3
"""Validate CIN JSON Schemas and their positive/negative structural examples."""
from copy import deepcopy
import json
from pathlib import Path
import sys

from jsonschema import Draft202012Validator, FormatChecker, ValidationError

ROOT = Path(__file__).resolve().parents[2]
CASES = [
    (
        ROOT / "specifications/schemas/cin-common-document-v1.schema.json",
        ROOT / "specifications/examples/cin-common-document-v1.example.json",
        "common document",
    ),
    (
        ROOT / "specifications/schemas/cin-verification-result-v1.schema.json",
        ROOT / "specifications/examples/cin-verification-result-v1.example.json",
        "verification result",
    ),
]


def load_json(path: Path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def expect_invalid(validator, instance, description: str):
    try:
        validator.validate(instance)
    except ValidationError:
        print(f"PASS negative structural case: {description}")
        return
    raise AssertionError(f"Negative case unexpectedly passed: {description}")


def main():
    loaded = {}
    for schema_path, example_path, label in CASES:
        schema = load_json(schema_path)
        example = load_json(example_path)
        Draft202012Validator.check_schema(schema)
        validator = Draft202012Validator(schema, format_checker=FormatChecker())
        validator.validate(example)
        loaded[label] = (validator, example)
        print(f"PASS schema and example: {label}")

    document_validator, document_example = loaded["common document"]
    bad_document = deepcopy(document_example)
    del bad_document["document"]["document_type"]
    expect_invalid(document_validator, bad_document, "common document requires document_type")

    bad_proof = deepcopy(document_example)
    del bad_proof["proofs"][0]["verification_method"]
    expect_invalid(document_validator, bad_proof, "signature proof requires verification_method")

    result_validator, result_example = loaded["verification result"]
    bad_decision = deepcopy(result_example)
    bad_decision["decision"] = "valid"
    expect_invalid(result_validator, bad_decision, "verification decision is not a boolean/valid flag")

    missing_check = deepcopy(result_example)
    del missing_check["checks"]["issuer_trust"]
    expect_invalid(result_validator, missing_check, "verification report requires issuer_trust result")

    invalid_check_status = deepcopy(result_example)
    invalid_check_status["checks"]["schema"]["status"] = "trusted"
    expect_invalid(result_validator, invalid_check_status, "schema check cannot report issuer trust status")

    print("CIN schema validation passed. Structural validity does not prove cryptographic validity or trust.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
