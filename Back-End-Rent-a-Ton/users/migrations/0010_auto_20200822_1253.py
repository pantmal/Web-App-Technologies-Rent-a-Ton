# Generated by Django 3.0.7 on 2020-08-22 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_customuser_secondary_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='secondary_id',
            field=models.IntegerField(),
        ),
    ]
