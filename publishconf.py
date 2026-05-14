import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from pelicanconf import *

SITEURL = "https://chen5677.github.io/Chen-blog"
RELATIVE_URLS = False

DELETE_OUTPUT_DIRECTORY = True

# RSS feeds
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"

# SEO
FEED_ALL_RSS = "feeds/all.rss.xml"
CATEGORY_FEED_RSS = "feeds/{slug}.rss.xml"

WITH_FUTURE_DATES = False

# Google Analytics (if needed later)
# GOOGLE_ANALYTICS = "UA-XXXXX-Y"
