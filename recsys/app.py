from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__, template_folder='template')

# Sample User Profiles
user_profiles = {
    'user1': 'slow',
    'user2': 'average',
    'user3': 'fast'
}

# Sample Video Database (Replace with YouTube API)
video_database = {
    'slow': [
        {'title': 'Java Basics', 'url': 'https://www.youtube.com/watch?v=bm0OyhwFDuY&list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5&index=2', 'difficulty': 'easy'},
        {'title': 'Java for Beginners', 'url': 'https://www.youtube.com/watch?v=ntLJmHOJ0ME&list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q', 'difficulty': 'easy'}
    ],
    'average': [
        {'title': 'Intermediate Java Concepts', 'url': 'https://www.youtube.com/watch?v=vW53w7me4AE&list=PL27BCE863B6A864E3', 'difficulty': 'medium'},
        {'title': 'Understanding JAVA', 'url': 'https://www.youtube.com/watch?v=vIXcT4hbR0U', 'difficulty': 'medium'}
    ],
    'fast': [
        {'title': 'Advanced JAVA', 'url': 'https://www.youtube.com/watch?v=AGGePFPiNfU&list=PLlhM4lkb2sEjVsbbZ_kiixY5CcR84IQUg', 'difficulty': 'hard'},
        {'title': 'JAVA projects', 'url': 'https://www.youtube.com/watch?v=k7YFy3qIF0M&list=PLN4C-bCgnnU0Vj1brODaJFi5z1m25XYjq', 'difficulty': 'hard'}
    ]
}

def recommend_videos(user_profile: str):
    if user_profile in video_database:
        return random.sample(video_database[user_profile], 2)
    else:
        return []

@app.route('/')
def home():
    return render_template('my_unique_template.html')


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user = data.get('user')
    user_profile = user_profiles.get(user)
    
    if user_profile:
        recommendations = recommend_videos(user_profile)
        return jsonify(recommendations)
    else:
        return jsonify({'error': 'User profile not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)