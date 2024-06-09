# Generated by Django 5.0.6 on 2024-06-05 01:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Accomodation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('country', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=500)),
                ('notes', models.TextField()),
                ('status', models.CharField(choices=[('C', 'Confirmed'), ('D', 'Done'), ('X', 'Cancelled'), ('I', 'Idea')], max_length=3)),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(max_length=2)),
                ('checkin_date', models.DateField()),
                ('checkin_time', models.TimeField()),
                ('checkout_date', models.DateField()),
                ('checkout_time', models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('country', models.CharField(max_length=200)),
                ('city', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=500)),
                ('status', models.CharField(choices=[('C', 'Confirmed'), ('D', 'Done'), ('X', 'Cancelled'), ('I', 'Idea')], max_length=3)),
                ('notes', models.TextField()),
                ('date', models.DateField()),
                ('time', models.TimeField()),
            ],
        ),
        migrations.CreateModel(
            name='DayItinerary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date', models.DateField()),
                ('notes', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='DayCost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date', models.DateField()),
                ('cost_type', models.CharField(choices=[('O', 'Other'), ('F', 'Food / Drinks'), ('ATV', 'Activity'), ('T', ' Transport'), ('S', 'Shopping'), ('ACC', 'Accomodation')], max_length=3)),
                ('notes', models.TextField()),
                ('cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(max_length=2)),
                ('activity', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='travlr.activity')),
            ],
        ),
        migrations.AddField(
            model_name='activity',
            name='day_itinerary',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='travlr.dayitinerary'),
        ),
    ]