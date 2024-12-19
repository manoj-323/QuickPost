import os
import django
from faker import Faker
import random


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from django.contrib.auth.models import User
from quickpost_server.models import UserProfile, Post, Comment

# Initialize Faker
fake = Faker()

def populate_users(n=10):
    """Create n fake users and associated user profiles."""
    for _ in range(n):
        user = User.objects.create_user(
            username=fake.user_name(),
            email=fake.email(),
            password="123"  # Default password for testing
        )
        user.save()

def populate_posts(n=20):
    """Create n fake posts."""
    users = list(User.objects.all())
    for _ in range(n):
        user = random.choice(users)
        Post.objects.create(
            user=user,
            text=fake.text(max_nb_chars=100),
        )

def populate_comments(n=50):
    """Create n fake comments."""
    users = list(User.objects.all())
    posts = list(Post.objects.all())
    for _ in range(n):
        Comment.objects.create(
            post=random.choice(posts),
            user=random.choice(users),
            text=fake.paragraph(nb_sentences=2)
        )

def main():
    print("Populating database...")
    populate_users(4)
    howmany = int(input("how many posts to generate: "))
    populate_posts(howmany)
    populate_comments(4)
    print("Done!")

if __name__ == "__main__":
    main()
