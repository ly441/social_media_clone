from datetime import datetime

from app import create_app
from app.extensions import db
from app.models import User, Post, Comment, Like, Follow

app = create_app()   # 🔥 create ONCE


def seed_database():
    """Seed the database with initial test data"""

    print("🗑️ Clearing existing data...")

    # Delete in FK-safe order
    Like.query.delete()
    Comment.query.delete()
    Follow.query.delete()
    Post.query.delete()
    User.query.delete()

    db.session.commit()

    # ---------------- USERS ----------------
    print("👥 Creating test users...")
    users = []

    admin = User(
        username="admin",
        email="admin@example.com",
        bio="System administrator",
        profile_picture="https://i.pravatar.cc/150?img=1"
    )
    admin.set_password("admin123")
    users.append(admin)

    for i in range(1, 6):
        user = User(
            username=f"user{i}",
            email=f"user{i}@example.com",
            bio=f"This is user {i}'s bio.",
            profile_picture=f"https://i.pravatar.cc/150?img={i+5}"
        )
        user.set_password(f"password{i}")
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

    # ---------------- POSTS ----------------
    print("📝 Creating posts...")
    posts = []

    post_contents = [
        "Just finished reading an amazing book! 📚",
        "Beautiful day for a hike! 🏞️",
        "Working on a new project 💻",
        "Coffee with friends ☕",
        "Learning something new 🌱",
        "Sunsets are the best 🌅",
        "5K run done 🏃‍♂️",
        "Cooking something delicious 🍳",
        "Music + work 🎵",
        "Planning the week ahead 📅"
    ]

    for i, content in enumerate(post_contents):
        post = Post(
            content=content,
            author=users[i % len(users)],
            image_url=f"https://picsum.photos/seed/post{i}/800/600" if i % 3 == 0 else None,
            created_at=datetime.utcnow()
        )
        posts.append(post)

    db.session.add_all(posts)
    db.session.commit()

    # ---------------- COMMENTS ----------------
    print("💬 Creating comments...")
    comments = []

    comment_contents = [
        "Great post!",
        "Totally agree!",
        "Nice!",
        "Well said!",
        "Love this!",
        "Interesting!",
        "Awesome!",
        "👏👏👏",
        "🔥🔥🔥",
        "Nice one!"
    ]

    for i in range(20):
        comment = Comment(
            content=comment_contents[i % len(comment_contents)],
            author=users[i % len(users)],
            post=posts[i % len(posts)]
        )
        comments.append(comment)

    db.session.add_all(comments)
    db.session.commit()

    # ---------------- LIKES ----------------
    print("❤️ Creating likes...")
    likes = []

    for user in users:
        for j in range(3):
            post = posts[(user.id + j) % len(posts)]
            likes.append(Like(user=user, post=post))

    db.session.add_all(likes)
    db.session.commit()

    # ---------------- FOLLOWS ----------------
    print("👥 Creating follows...")
    follows = []

    for i, user in enumerate(users):
        for j in range(1, 3):
            followed = users[(i + j) % len(users)]
            if user != followed:
                follows.append(
                    Follow(follower=user, followed=followed)
                )

    db.session.add_all(follows)
    db.session.commit()

    # ---------------- SUMMARY ----------------
    print("\n" + "=" * 50)
    print("✅ DATABASE SEEDING COMPLETE!")
    print("=" * 50)
    print(f"Users: {User.query.count()}")
    print(f"Posts: {Post.query.count()}")
    print(f"Comments: {Comment.query.count()}")
    print(f"Likes: {Like.query.count()}")
    print(f"Follows: {Follow.query.count()}")


if __name__ == "__main__":
    with app.app_context():   # 🔥 REQUIRED
        seed_database()

    