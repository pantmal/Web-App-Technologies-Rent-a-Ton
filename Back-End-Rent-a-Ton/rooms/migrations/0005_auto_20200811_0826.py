# Generated by Django 3.0.7 on 2020-08-11 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0004_auto_20200811_0822'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='room_type',
            field=models.CharField(choices=[('Private room', 'PRIVATE ROOM'), ('Shared room', 'SHARED ROOM'), ('Entire home/apt', 'ENTIRE HOUSE')], default='Entire home/apt', max_length=20),
        ),
    ]
