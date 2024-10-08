# Generated by Django 5.1 on 2024-09-03 06:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('preregistrations', '0003_alter_preregistration_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='preregistration',
            name='coupon_code',
            field=models.CharField(blank=True, max_length=8, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='preregistration',
            name='is_coupon_used',
            field=models.BooleanField(default=False),
        ),
    ]
