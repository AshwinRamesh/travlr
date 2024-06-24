# Generated by Django 5.0.6 on 2024-06-24 09:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travlr', '0005_alter_accommodation_checkin_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='time',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='daycost',
            name='cost_type',
            field=models.CharField(choices=[('O', 'Other'), ('F', 'Food / Drinks'), ('ATV', 'Activity'), ('T', ' Transport'), ('S', 'Shopping'), ('ACC', 'Accommodation')], max_length=3),
        ),
    ]
