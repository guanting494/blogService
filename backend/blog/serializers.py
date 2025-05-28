from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    """
    This serializer handles the serialization and deserialization of blog posts,
    """
    author = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        # Specify the fields to be included in the serialized output
        fields = ['id', 'title', 'content', 'summary', 'author', 
                 'published_date', 'updated_date', 'tags']
        read_only_fields = ['author', 'published_date', 'updated_date'] # these fields are set automatically

    def create(self, validated_data):
        # Automatically set the author to the current user when creating a new blog post
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)