# Generated by Django 3.0.7 on 2020-08-16 17:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0007_searcheditem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservation',
            name='price',
        ),
    ]