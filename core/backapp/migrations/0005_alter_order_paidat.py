# Generated by Django 4.2.5 on 2023-09-19 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "backapp",
            "0004_rename_qty_orderitem_quantity_orderitem_countinstock_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="paidAt",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]