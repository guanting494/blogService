from django.db import models
from django.conf import settings
from blog.models import BlogPost  # Make sure this import path matches your BlogPost location


class Comment(models.Model):
    """
    Comment model for blog posts.
    Each comment is associated with a blog post and an author (user).
    Comments are ordered by creation date in ascending order (oldest first).
    """
    post = models.ForeignKey(
        BlogPost, 
        on_delete=models.CASCADE, 
        related_name='comments',
        help_text='The blog post this comment belongs to'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_comments'
    )
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_date']
        verbose_name = 'comment'
        verbose_name_plural = 'comments'

    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'