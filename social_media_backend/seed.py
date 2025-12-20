# seed.py
from app import create_app, db
from app.models import User, Post, Comment, Like, Follow
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

# Create the Flask app
app = create_app()

def seed_database():
    # Run everything within app context
    with app.app_context():
        print("🗑️ Clearing existing data...")
        
        
        # Create users
        users = []
        user_data = [
            {'username': 'john_doe', 'email': 'john@example.com', 'full_name': 'John Doe'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'full_name': 'Jane Smith'},
            {'username': 'bob_wilson', 'email': 'bob@example.com', 'full_name': 'Bob Wilson'},
            {'username': 'alice_jones', 'email': 'alice@example.com', 'full_name': 'Alice Jones'},
            {'username': 'charlie_brown', 'email': 'charlie@example.com', 'full_name': 'Charlie Brown'},
        ]
        
        for data in user_data:
            user = User(
                username=data['username'],
                email=data['email'],
                password_hash=generate_password_hash('password123'),
                bio=f"Hi, I'm {data['full_name']}!",
                created_at=datetime.utcnow()
            )
            users.append(user)
            db.session.add(user)
        
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        print("📝 Creating posts...")
        
        # Create posts
        posts = []
        post_contents = [
            "Just had an amazing coffee ☕",
            "Beautiful sunset today! 🌅",
            "Working on a new project 💻",
            "Weekend vibes! 🎉",
            "Loving this weather ☀️",
            "New blog post is live! Check it out",
            "Finished reading a great book 📚",
            "Exploring new places 🗺️",
            "Coding session in progress... 👨‍💻",
            "Dinner was delicious! 🍝"
        ]
        
        for i, content in enumerate(post_contents):
            post = Post(
                content=content,
                user_id=random.choice(users).id,
                created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
            )
            posts.append(post)
            db.session.add(post)
        
        db.session.commit()
        print(f"✅ Created {len(posts)} posts")
        
        print("💬 Creating comments...")
        
        # Create comments
        comments = []
        comment_texts = [
            "Great post!",
            "I totally agree!",
            "Thanks for sharing!",
            "This is awesome!",
            "Love it! ❤️",
            "Very interesting!",
            "Nice one!",
            "Well said!",
        ]
        
        for post in posts:
            # Random number of comments per post (0-3)
            num_comments = random.randint(0, 3)
            for _ in range(num_comments):
                comment = Comment(
                    content=random.choice(comment_texts),
                    user_id=random.choice(users).id,
                    post_id=post.id,
                    created_at=post.created_at + timedelta(hours=random.randint(1, 24))
                )
                comments.append(comment)
                db.session.add(comment)
        
        db.session.commit()
        print(f"✅ Created {len(comments)} comments")
        
        print("❤️ Creating likes...")
        
        # Create likes
        likes = []
        for post in posts:
            # Random number of likes per post (1-4)
            num_likes = random.randint(1, 4)
            liking_users = random.sample(users, min(num_likes, len(users)))
            
            for user in liking_users:
                like = Like(
                    user_id=user.id,
                    post_id=post.id,
                    created_at=post.created_at + timedelta(minutes=random.randint(1, 120))
                )
                likes.append(like)
                db.session.add(like)
        
        db.session.commit()
        print(f"✅ Created {len(likes)} likes")
        
        print("👥 Creating follows...")
        
        # Create follows
        follows = []
        for user in users:
            # Each user follows 2-3 other users
            num_follows = random.randint(2, 3)
            other_users = [u for u in users if u.id != user.id]
            following = random.sample(other_users, min(num_follows, len(other_users)))
            
            for followed_user in following:
                follow = Follow(
                    follower_id=user.id,
                    followed_id=followed_user.id,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 60))
                )
                follows.append(follow)
                db.session.add(follow)
        
        db.session.commit()
        print(f"✅ Created {len(follows)} follows")
        
        print("\n🎉 Database seeded successfully!")
        print(f"📊 Summary:")
        print(f"   - Users: {len(users)}")
        print(f"   - Posts: {len(posts)}")
        print(f"   - Comments: {len(comments)}")
        print(f"   - Likes: {len(likes)}")
        print(f"   - Follows: {len(follows)}")

if __name__ == '__main__':
    seed_database()
    