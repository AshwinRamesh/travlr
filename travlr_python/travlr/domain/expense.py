from typing import List

from django.core.exceptions import ValidationError

from ..models import DayCost
from .validation import validate_param
from django import forms


def create_or_update_expense(trip_id, name, date, cost_type, cost, currency, notes, activity_id=None, cost_id=None):
    day_cost = DayCost.objects.get(id=cost_id) if cost_id else DayCost()

    day_cost.trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    day_cost.name = validate_param(forms.CharField(), 'name', name)
    day_cost.date = validate_param(forms.DateField(), 'date', date)
    day_cost.cost_type = validate_param(forms.CharField(), 'cost_type', cost_type)
    day_cost.cost = validate_param(forms.DecimalField(required=False), 'cost', cost)
    day_cost.currency = validate_param(forms.CharField(required=False), 'currency', currency)
    day_cost.notes = validate_param(forms.CharField(required=False), 'notes', notes)
    day_cost.activity_id = validate_param(forms.IntegerField(required=False), 'activity_id', activity_id)

    if day_cost.cost <= 0.0:
        raise ValidationError("cost cannot be <= 0")

    day_cost.save()
    return day_cost


def get_expenses_for_date(trip_id, date) -> List[DayCost]:
    trip_id = validate_param(forms.IntegerField(), 'trip_id', trip_id)
    date = validate_param(forms.DateField(), 'date', date)
    q = DayCost.objects.filter(trip_id=trip_id, date=date).all()
    return list(q)
