from django.http import HttpResponse

def home_view(request):
    html_content = """
    <html>
      <head>
        <title>LMS Home</title>
      </head>
      <body>
        <h1>Welcome to the LMS</h1>
        <ul>
          <li><a href="/accounts/register/">Register</a></li>
          <li><a href="/accounts/login/">Login</a></li>
          <li><a href="/accounts/logout/">Logout</a></li>
        </ul>
      </body>
    </html>
    """
    return HttpResponse(html_content)