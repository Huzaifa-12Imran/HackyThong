class RunwayCalculator:
    """All arithmetic lives here. Gemini never does math."""

    def calculate_impact(self, stack_profile: dict, monthly_saving: float) -> dict:
        burn_rate = stack_profile.get('burn_rate', 18000)
        total_monthly_cost = stack_profile.get('total_monthly_cost',
                                               self._sum_costs(stack_profile))

        # All arithmetic in Python, never in Gemini
        new_monthly_cost = total_monthly_cost - monthly_saving
        saving_percentage = (monthly_saving / total_monthly_cost * 100) if total_monthly_cost > 0 else 0

        # Runway extension: saving / burn_rate * 30 days
        runway_extension_days = round((monthly_saving / burn_rate) * 30) if burn_rate > 0 else 0
        annual_saving = monthly_saving * 12

        return {
            "current_cost": round(total_monthly_cost, 2),
            "new_cost": round(new_monthly_cost, 2),
            "monthly_saving": round(monthly_saving, 2),
            "annual_saving": round(annual_saving, 2),
            "saving_percentage": round(saving_percentage, 1),
            "runway_extension_days": runway_extension_days,
            "runway_extension_explanation": (
                f"At ${burn_rate:,}/month burn rate, saving "
                f"${monthly_saving:.0f}/month extends runway by "
                f"{runway_extension_days} days"
            )
        }

    def calculate_health_score(self, stack_profile: dict, issues: list) -> dict:
        base_score = 100

        deductions = {
            "deprecation": 15,     # immediate breaking risk
            "cost_saving": 8,      # missed optimization
            "opportunity": 5,      # nice to have
        }

        for issue in issues:
            issue_type = issue.get('type', 'opportunity')
            urgency_multiplier = {
                "immediate": 1.0,
                "this_week": 0.7,
                "this_month": 0.4
            }.get(issue.get('urgency', 'this_month'), 0.4)

            deduction = deductions.get(issue_type, 5) * urgency_multiplier
            base_score -= deduction

        final_score = max(0, round(base_score))

        grade_map = [
            (95, "A+"), (90, "A"), (85, "A-"),
            (80, "B+"), (75, "B"), (70, "B-"),
            (65, "C+"), (60, "C"), (0, "D")
        ]
        grade = next(g for threshold, g in grade_map if final_score >= threshold)

        return {
            "score": final_score,
            "grade": grade,
            "explanation": self._explain_score(final_score, issues)
        }

    def _explain_score(self, score: int, issues: list) -> str:
        deprecations = sum(1 for i in issues if i.get('type') == 'deprecation')
        savings = sum(1 for i in issues if i.get('type') == 'cost_saving')

        if deprecations > 0:
            return (f"{deprecations} breaking change"
                    f"{'s' if deprecations > 1 else ''} detected. "
                    f"Immediate action required.")
        elif savings > 0:
            return (f"Stack healthy. {savings} cost optimization"
                    f"{'s' if savings > 1 else ''} available.")
        return "Stack fully optimized. No action required."

    def _sum_costs(self, stack_profile: dict) -> float:
        """Sum all costs from a stack profile's sub-categories."""
        total = 0
        for category in ['models', 'infrastructure', 'saas_tools']:
            items = stack_profile.get(category, [])
            for item in items:
                total += item.get('monthly_cost', 0)
        return total if total > 0 else 1150  # fallback demo cost
