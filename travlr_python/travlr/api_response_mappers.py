from typing import List

from .models import DayCost


def map_expense(expense: DayCost) -> dict:
    return {
        'id': expense.id,
        'name': expense.name,
        'date': expense.date,
        'type': expense.cost_type,
        'notes': expense.notes,
        'cost': expense.cost,
        'currency': expense.currency,
        'activityId': expense.activity_id,
    }


def map_expenses(expenses: List[DayCost]) -> dict:
    return {
        'expenses': [map_expense(e) for e in expenses],
        'types': DayCost.COST_TYPES,
    }
