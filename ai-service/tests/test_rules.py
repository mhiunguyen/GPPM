from ai_app.logic.rules import decide_risk


def test_rules_severe_symptom_is_high():
    cv = {"melanoma": 0.0, "eczema": 0.0}
    risk, reason = decide_risk(cv, ["chảy máu"])  # severe flag
    assert risk.startswith("CAO")


def test_rules_melanoma_high_is_high():
    cv = {"melanoma": 0.35, "eczema": 0.0}
    risk, reason = decide_risk(cv, [])
    assert risk.startswith("CAO")


def test_rules_default_is_low():
    cv = {"melanoma": 0.05, "eczema": 0.1}
    risk, reason = decide_risk(cv, [])
    assert risk.startswith("THẤP")
