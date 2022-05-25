# Generated by Django 3.0.7 on 2020-08-23 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='receiver_name',
            field=models.CharField(default='User1', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='message',
            name='sender_name',
            field=models.CharField(default='User3', max_length=100),
            preserve_default=False,
        ),
    ]
