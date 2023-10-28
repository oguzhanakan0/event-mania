from django.views.generic import TemplateView


class HomeView(TemplateView):
    """home view"""

    template_name = "main/main.html"
