# Generated by Django 3.0.7 on 2020-08-22 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20200807_1107'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='secondary_id',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
