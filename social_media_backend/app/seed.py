from app import create_app
from app.extensions import db
from app.models import User, Post, Comment, Like, Follow
from datetime import datetime
import bcrypt

def seed_database():
    """Seed the database with initial test data"""
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        print("🗑️ Clearing existing data...")
        Like.query.delete()
        Comment.query.delete()
        Post.query.delete()
        Follow.query.delete()
        User.query.delete()
        
        # Create test users
        print("👥 Creating test users...")
        users = []
        
        # Create admin user
        admin = User(
            username="admin",
            email="admin@example.com",
            bio="System administrator",
            profile_picture="https://i.pravatar.cc/150?img=1"
        )
        admin.set_password("admin123")
        users.append(admin)
        
        # Create regular users
        for i in range(1, 6):
            user = User(
                username=f"user{i}",
                email=f"user{i}@example.com",
                bio=f"This is user {i}'s bio. Welcome to my profile!",
                profile_picture=f"https://i.pravatar.cc/150?img={i+5}"
            )
            user.set_password(f"password{i}")
            users.append(user)
        
        db.session.add_all(users)
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        # Create posts
        print("📝 Creating posts...")
        posts = []
        
        post_contents = [
            "Just finished reading an amazing book! 📚 #reading",
            "Beautiful day for a hike! 🏞️ #nature #outdoors",
            "Working on a new project. Excited to share soon! 💻 #coding",
            "Had a great coffee with friends today! ☕ #social",
            "Learning something new every day! 🌱 #growth",
            "The sunset today was absolutely breathtaking! 🌅",
            "Just completed a 5K run! 🏃‍♂️ #fitness #health",
            "Cooked a delicious meal today! 🍳 #cooking",
            "Listening to some great music while working 🎵",
            "Reflecting on the week and planning for the next 📅"
        ]
        
        for i, content in enumerate(post_contents):
            post = Post(
                content=content,
                user_id=users[i % len(users)].id,
                image_url=f"https://picsum.photos/seed/post{i}/800/600" if i % 3 == 0 else None,
                created_at=datetime.utcnow()
            )
            posts.append(post)
        
        db.session.add_all(posts)
        db.session.commit()
        print(f"✅ Created {len(posts)} posts")
        
        # Create comments
        print("💬 Creating comments...")
        comments = []
        
        comment_contents = [
            "Great post! 👍",
            "I totally agree!",
            "Thanks for sharing!",
            "This is amazing!",
            "Keep up the good work!",
            "Interesting perspective!",
            "I learned something new!",
            "Beautiful! 😍",
            "Can't wait to see more!",
            "Well said! 👏"
        ]
        
        for i in range(20):  # Create 20 comments
            comment = Comment(
                content=comment_contents[i % len(comment_contents)],
                user_id=users[i % len(users)].id,
                post_id=posts[i % len(posts)].id
            )
            comments.append(comment)
        
        db.session.add_all(comments)
        db.session.commit()
        print(f"✅ Created {len(comments)} comments")
        
        # Create likes
        print("❤️ Creating likes...")
        likes = []
        
        # Each user likes 3 random posts
        for user in users:
            for j in range(3):
                post = posts[(user.id + j) % len(posts)]
                like = Like(user_id=user.id, post_id=post.id)
                likes.append(like)
        
        db.session.add_all(likes)
        db.session.commit()
        print(f"✅ Created {len(likes)} likes")
        
        # Create follows
        print("👥 Creating follows...")
        follows = []
        
        # Each user follows 2 other users
        for i, user in enumerate(users):
            for j in range(1, 3):  # Follow next 2 users
                followed_user = users[(i + j) % len(users)]
                if user.id != followed_user.id:
                    follow = Follow(
                        follower_id=user.id,
                        followed_id=followed_user.id
                    )
                    follows.append(follow)
        
        db.session.add_all(follows)
        db.session.commit()
        print(f"✅ Created {len(follows)} follows")
        
        print("\n" + "=" * 50)
        print("✅ DATABASE SEEDING COMPLETE!")
        print("=" * 50)
        print(f"Total users: {User.query.count()}")
        print(f"Total posts: {Post.query.count()}")
        print(f"Total comments: {Comment.query.count()}")
        print(f"Total likes: {Like.query.count()}")
        print(f"Total follows: {Follow.query.count()}")
        print("\n📋 Test Credentials:")
        print("  Admin: admin / admin123")
        print("  User1: user1 / password1")
        print("  User2: user2 / password2")
        print("  User3: user3 / password3")
        print("  User4: user4 / password4")
        print("  User5: user5 / password5")

if __name__ == "__main__":
    seed_database()