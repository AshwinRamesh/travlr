from django import forms
from django.core.exceptions import ValidationError


def validate_param(form_field: forms.Field, field_name: str, val):
    try:
        return form_field.clean(val)
    except ValidationError as e:
        e.message = "{} - {}".format(field_name, e.message)
        raise e