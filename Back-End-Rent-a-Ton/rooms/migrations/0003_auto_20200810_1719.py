# Generated by Django 3.0.7 on 2020-08-10 17:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0002_clickeditem_hostrating_reservation_roomimage_roomrating'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='is_reversed',
            new_name='reserved',
        ),
    ]
