# Generated by Django 4.2.5 on 2023-09-19 18:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("backapp", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="paymentResult",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="backapp.paymentresult",
            ),
        ),
    ]
