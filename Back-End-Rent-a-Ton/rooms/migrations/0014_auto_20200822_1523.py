# Generated by Django 3.0.7 on 2020-08-22 15:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0013_auto_20200822_1130'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='secondary_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='roomrating',
            name='secondary_id',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
