# backend/users/adapters.py

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter # 导入 DefaultAccountAdapter
from allauth.utils import get_user_model

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    自定义社交账户适配器，处理 allauth 与 dj-rest-auth 的兼容性问题。
    """
    # 解决 'get_user_search_fields' 错误
    def get_user_search_fields(self):
        """
        返回用于用户搜索的字段。
        allauth 管理员界面可能需要此方法。
        """
        User = get_user_model()
        # 默认情况下，通常是 'username', 'email'
        # 你可以根据你的 User 模型实际字段来定义
        if hasattr(User, 'USERNAME_FIELD') and User.USERNAME_FIELD:
            return [User.USERNAME_FIELD, 'email']
        return ['username', 'email']

    # 解决 'is_ajax' 错误
    def is_ajax(self, request):
        """
        检查请求是否为 AJAX 请求。
        对于某些 allauth 视图（例如 LogoutView），如果你的前端使用 AJAX 进行登出，
        它可能会尝试调用此方法。
        """
        # 检查 X-Requested-With 头，这是传统的 AJAX 识别方式
        return request.headers.get('x-requested-with') == 'XMLHttpRequest' or \
               request.accepts('application/json')
        # 简单的判断，或者你可以更复杂地检查请求类型


# 如果你在 settings.py 中也指定了 ACCOUNT_ADAPTER，也可能需要自定义它
class MyAccountAdapter(DefaultAccountAdapter):
    def get_user_search_fields(self):
        User = get_user_model()
        if hasattr(User, 'USERNAME_FIELD') and User.USERNAME_FIELD:
            return [User.USERNAME_FIELD, 'email']
        return ['username', 'email']