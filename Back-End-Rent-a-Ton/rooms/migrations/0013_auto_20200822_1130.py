# Generated by Django 3.0.7 on 2020-08-22 11:30

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rooms', '0012_auto_20200820_1513'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='RecommendedItem',
            new_name='Recommendation',
        ),
        migrations.RemoveField(
            model_name='room',
            name='reserved',
        ),
    ]
