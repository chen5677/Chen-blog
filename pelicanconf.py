AUTHOR = "Chen5677"
SITENAME = "Chen Lab"
SITEURL = ""
SITETITLE = "Chen Lab"
SITESUBTITLE = "记录技术与生活"
SITEDESCRIPTION = "个人技术博客，分享编程、技术与生活随笔"
SITELOGO = "/images/profile.jpg"
FAVICON = "/images/favicon.png"

PATH = "content"
THEME = "themes/flex"

TIMEZONE = "Asia/Shanghai"
DEFAULT_LANG = "zh"
LOCALE = ("zh_CN", "zh_CN.UTF-8", "zh_CN.utf8")

# Feed generation
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# URL settings
ARTICLE_URL = "posts/{date:%Y}/{date:%m}/{slug}/"
ARTICLE_SAVE_AS = "posts/{date:%Y}/{date:%m}/{slug}/index.html"
PAGE_URL = "{slug}/"
PAGE_SAVE_AS = "{slug}/index.html"
CATEGORY_URL = "category/{slug}/"
CATEGORY_SAVE_AS = "category/{slug}/index.html"
TAG_URL = "tag/{slug}/"
TAG_SAVE_AS = "tag/{slug}/index.html"
AUTHOR_URL = "author/{slug}/"
AUTHOR_SAVE_AS = ""
INDEX_SAVE_AS = "index.html"

# Pagination
DEFAULT_PAGINATION = 10
PAGINATION_PATTERNS = (
    (1, "{base_name}/", "{base_name}/index.html"),
    (2, "{base_name}/page/{number}/", "{base_name}/page/{number}/index.html"),
)

# Static files
STATIC_PATHS = ["images", "extra"]
EXTRA_PATH_METADATA = {
    "extra/robots.txt": {"path": "robots.txt"},
    "extra/favicon.ico": {"path": "favicon.ico"},
}

# Pages
DISPLAY_PAGES_ON_MENU = True
DISPLAY_CATEGORIES_ON_MENU = False
MENUITEMS = (
    ("归档", "/archives.html"),
    ("分类", "/categories.html"),
    ("标签", "/tags.html"),
)

# Content
ARTICLE_ORDER_BY = "date"
TYPOGRAPHIC_IMPROVEMENTS = True
DEFAULT_METADATA = {"status": "published"}

# Plugins (pelican-sitemap is installed via pip as a namespace plugin)
PLUGINS = ["sitemap"]

# Sitemap
SITEMAP = {
    "format": "xml",
    "priorities": {
        "articles": 0.8,
        "indexes": 0.5,
        "pages": 0.6,
    },
    "changefreqs": {
        "articles": "monthly",
        "indexes": "daily",
        "pages": "monthly",
    },
}

# Theme customization (Flex)
PYGMENTS_STYLE = "monokai"
THEME_COLOR = "dark"
THEME_COLOR_AUTO_DETECT_BROWSER_PREFERENCE = True
THEME_COLOR_ENABLE_USER_OVERRIDE = True

# Giscus Comments (configure after creating GitHub repo)
# See: https://github.com/apps/giscus
# GISCUS_REPO = "your-username/your-repo"
# GISCUS_REPO_ID = ""
# GISCUS_CATEGORY = "Announcements"
# GISCUS_CATEGORY_ID = ""

# GoatCounter Analytics (register at https://www.goatcounter.com)
# GOATCOUNTER_CODE = "your-code"
