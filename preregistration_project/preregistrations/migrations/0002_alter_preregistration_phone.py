# Generated by Django 5.1 on 2024-09-01 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preregistrations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preregistration',
            name='phone',
            field=models.CharField(max_length=13, unique=True),
        ),
    ]
