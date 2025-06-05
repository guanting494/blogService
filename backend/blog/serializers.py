from rest_framework import serializers
from .models import BlogPost
import markdown as md
import bleach

class BlogPostSerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of blog posts,
    """
    author = serializers.CharField(source='author.username', read_only=True)
    content_html = serializers.SerializerMethodField()
    class Meta:
        model = BlogPost
        # Specify the fields to be included in the serialized output
        fields = ['id', 'title', 'content', 'content_html', 'summary', 'author', 
                 'published_date', 'updated_date', 'tags']
        read_only_fields = ['author', 'published_date', 'updated_date'] # these fields are set automatically

    def create(self, validated_data):
        # Automatically set the author to the current user when creating a new blog post
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
    
    def get_content_html(self, obj):
        html = md.markdown(obj.content)
        # 只允许常见安全标签和属性
        allowed_tags = list(bleach.sanitizer.ALLOWED_TAGS) + [
            'p', 'pre', 'code', 'hr', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'strong', 'em', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ]
        allowed_attributes = {
            '*': ['class', 'style'],
            'a': ['href', 'title', 'rel'],
            'img': ['src', 'alt', 'title'],
        }
        return bleach.clean(html, tags=allowed_tags, attributes=allowed_attributes, strip=True)