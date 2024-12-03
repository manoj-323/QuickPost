# Generated by Django 5.1.3 on 2024-12-01 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quickpost_server', '0007_alter_post_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.CharField(blank=True, default='https://picsum.photos/385/202', max_length=100),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='profilePicture',
            field=models.ImageField(blank=True, default='profilePicture/default-pfp.png', upload_to='profilePicture'),
        ),
    ]
