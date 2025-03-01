from bs4 import BeautifulSoup
import requests
from datetime import datetime, date, timedelta
import heapq
import asyncio
import aiohttp
import re, json
import os
from pymongo.mongo_client import MongoClient

# Connect to db
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)
db = client['letterboxd']

# Limit concurrent requests
semaphore = asyncio.Semaphore(5)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

# Function to convert a value to a star_rating
def convert_to_stars(rating):
    rating_10scale = float(rating) * 2  # Convert rating to a scale of 0-10
    full_stars = int(rating_10scale // 2)  # Number of full stars
    half_star = "½" if rating_10scale % 2 == 1 else ""  # Add "½" if there's a remainder
    return "★" * full_stars + half_star  # Combine full stars and half star


# Function to get page count
def get_page_count(count_url, username):
    r = requests.get(count_url.format(username))

    soup = BeautifulSoup(r.text, "lxml")

    body = soup.find("body")

    try:
        if "error" in body["class"]:
            return -1, None
    except KeyError:
        print(body)
        return -1, None

    try:
        page_link = soup.findAll("li", attrs={"class", "paginate-page"})[-1]
        num_pages = int(page_link.find("a").text.replace(",", ""))
    except IndexError:
        num_pages = 1

    return num_pages


# Function to get the user's film data
def get_user_films(username, all_data = False):
    # Default data
    last_movie = ""
    max_extraction_order = 0


    # Get the user_films collection
    collection = db["user_films"]

    # Check if the user exists in the database
    if collection.count_documents({"user":username}) > 0:
        # Find the document with the max extraction_order
        last_user_log = collection.find_one({"user": username}, sort=[("extraction_order", -1)])

        # Get the last movie logged and the max extraction order
        last_movie = last_user_log['query']
        max_extraction_order = last_user_log['extraction_order']

    # Ignore last movie if all_data=True
    if all_data:
        last_movie = ""

    # Get the page count for that user
    page_count = get_page_count("https://letterboxd.com/{}/films/by/date", username)

    # Cut the function if page_count is not an integer
    if not isinstance(page_count, int):
        print(f"{username}: page_count isn't an integer")
        return


    # Empty list to store the pages' data and the extraction orders
    new_data = []
    new_extraction_orders = []

    # Iterate through the pages
    film_query = ""
    for num_page in range(1, page_count+1):
        url = "https://letterboxd.com/{}/films/by/date/page/{}/"

        # Format the URL with the current page number
        r = requests.get(url.format(username, num_page))

        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(r.text, "lxml")


        # Find all <li> elements with class "poster-cointainer"
        poster_containers = soup.find_all("li", class_="poster-container")

        # Iterate throught he poster containers
        for container in poster_containers:
            entry = {}  # Initialize a dictionary to store each entry's data

            # Get the film query and film link
            div = container.find("div", class_="really-lazy-load")
            if div:
                film_query = div.get("data-film-slug", "")
                entry['query'] = film_query

                # Stop iterating if the current query is the last movie extracted
                if film_query == last_movie or film_query == "":
                    break
            
            # Get the film title from the alt attribute of the <img> tag
            img = div.find("img") if div else None
            if img:
                film_title = img.get("alt", "")
                entry["title"] = film_title
            
            # Find the span with the class that starts with "rating -micro -darker rated-"
            rating_span = container.find("span", class_=lambda x: x and x.startswith("rating -micro -darker rated-"))
            # Check if the span was found
            if rating_span:
                # Extract the class and get the rating value
                rating_class = rating_span['class']
                # Assuming the rating value is always the last part of the class string
                rating_value = int(rating_class[-1].replace("rated-", ""))  # Convert "rated-10" to 10
            else:
                rating_value = 0  # Default value if no span is found
            entry["rating"] = round(int(rating_value) / 2, 2)

            # Add extraction order
            max_extraction_order += 1
            new_extraction_orders.append(max_extraction_order)

            # Append the dictionary to the list
            new_data.append(entry)
        
        # Stop iteration if the current movie is the last movie extracted
        if film_query == last_movie or film_query == "":
            break

    # Check if new_data is not empty
    if new_data:
        # Add new keys to each dictionary
        for i, dic in enumerate(new_data):
            dic["user"] = username
            dic["extraction_date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            dic["extraction_order"] = new_extraction_orders[::-1][i]  # Flip it so the last value is the first

        # Insert the list of dictionaries into the collection
        collection.insert_many(new_data)


# Function to get the user's diary data
def get_user_diary(username, all_data = False):
    # Default data
    last_movie = ""
    max_extraction_order = 0

    # Get the user_diaries collection
    collection = db["user_diaries"]

    # Check if the user exists in the database
    if collection.count_documents({"user":username}) > 0:
        # Find the document with the max extraction_order
        last_user_log = collection.find_one({"user": username}, sort=[("extraction_order", -1)])

        # Get the last movie logged and the max extraction order
        last_movie = last_user_log['query']
        max_extraction_order = last_user_log['extraction_order']

    # Ignore last movie if all_data=True
    if all_data:
        last_movie = ""

    # Get the page count for that user
    page_count = get_page_count("https://letterboxd.com/{}/films/diary/", username)

    # Cut the function if page_count is not an integer
    if not isinstance(page_count, int):
        print(f"{username}: page_count isn't an integer")
        return
        

    # Empty list to store the pages' data and the extraction orders
    new_data = []
    new_extraction_orders = []

    # Iterate through the pages
    for num_page in range(1, page_count+1):
        url = "https://letterboxd.com/{}/films/diary/page/{}/"

        # Format the URL with the current page number
        r = requests.get(url.format(username, num_page))

        # Parse the HTML content with BeautifulSoup
        soup = BeautifulSoup(r.text, "lxml")

        # Find all relevant <tr> tags
        rows = soup.find_all("tr", class_=lambda x: x and x.startswith("diary-entry-row viewing-poster-container"))

        # Extract data from the first relevant <a> tag (if you want to handle multiple, you can loop through 'rows')
        film_query = ""
        for row in rows:
            entry = {}

            # film_query
            film_div = row.find("div", class_=lambda x: x and x.startswith("really-lazy-load poster film-poster"))
            film_query = film_div.get("data-film-slug", None) if film_div else None
            
            # viewing_date
            day_td = row.find("td", class_="td-day diary-day center")
            viewing_date = None
            if day_td:
                day_link = day_td.find("a")
                if day_link:
                    href = day_link.get("href", "")
                    viewing_date = "-".join(href.strip("/").split("/")[-3:])
            
            # film_rating
            rating_input = row.find("input", class_=lambda x: x and x.startswith("rateit-field diary-rating-"))
            film_rating = rating_input.get("value", None) if rating_input else None
            
            # film_liked
            liked_span = row.find("span", class_="has-icon icon-16 large-liked icon-liked hide-for-owner")
            film_liked = liked_span is not None
            
            # film_rewatch
            rewatch_td = row.find("td", class_="td-rewatch center")
            film_rewatch = bool(rewatch_td and rewatch_td.find("span", class_="has-icon icon-rewatch icon-16"))


            # Break the iteration if the current movie is the last movie logged
            if film_query == last_movie or film_query == "":
                break
            

            # Create dictionary
            entry = {'user':username, 'query':film_query, 'viewing_date':viewing_date,
                    'rating': round(int(film_rating) / 2, 2), 'liked':film_liked, 'rewatch':film_rewatch}

            # Add extraction order
            max_extraction_order += 1
            new_extraction_orders.append(max_extraction_order)
            
            # Add dictionary entry to the new_data list
            new_data.append(entry)
        
        # Break the iteration if the current movie is the last movie logged
        if film_query == last_movie or film_query == "":
            break

    # Check if new_data is not empty
    if new_data:
        # Add new keys to each dictionary
        for i, dic in enumerate(new_data):
            dic["user"] = username
            dic["extraction_date"] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            dic["extraction_order"] = new_extraction_orders[::-1][i]  # Flip it so the last value is the first

        # Insert the list of dictionaries into the collection
        collection.insert_many(new_data)


# Functions to extract updated film_data
async def fetch_film_data(session, query):
    url = f"https://letterboxd.com/film/{query}/"
    
    async with semaphore:  # Limit concurrency
        async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "lxml")

            avg_rating = 0
            meta_tag = soup.find("meta", {"name": "twitter:data2"})
            if meta_tag and "content" in meta_tag.attrs:
                try:
                    content = meta_tag["content"]
                    avg_rating = round(float(content.split()[0]), 2)
                except Exception:
                    pass

            vote_count = 0
            img_url = ""
            script_tag = soup.find("script", type="application/ld+json")
            if script_tag:
                try:
                    json_content = re.sub(r'/\*.*?\*/', '', script_tag.string, flags=re.DOTALL)
                    data = json.loads(json_content)
                    if 'aggregateRating' in data and 'ratingCount' in data['aggregateRating']:
                        vote_count = data['aggregateRating']['ratingCount']
                    if 'image' in data:
                        img_url = data['image']
                except Exception:
                    pass

            release_date = ""
            h3_tag = soup.find(lambda tag: tag.name == "h3" and tag.get("class") == ["release-table-title"] 
                               and tag.text.strip() not in ["Premiere", "Theatrical limited"])
            if h3_tag:
                release_div = h3_tag.find_next("div", class_="release-table -bydate")
                if release_div:
                    date_tag = release_div.find("h5", class_="date")
                    if date_tag:
                        try:
                            date_text = date_tag.text.strip()
                            release_date = datetime.strptime(date_text, "%d %b %Y").strftime("%Y-%m-%d")
                        except Exception:
                            pass

            total_minutes = 0
            p_tag = soup.find("p", class_="text-link text-footer")
            if p_tag:
                try:
                    total_minutes = int(p_tag.text.strip().split()[0])
                except Exception:
                    pass

            return {
                'query': query,
                'avg_rating': avg_rating,
                'vote_count': vote_count,
                'release_date': release_date,
                'total_minutes': total_minutes
            }

async def main(user_queries):
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
        tasks = [fetch_film_data(session, query) for query in user_queries]
        return await asyncio.gather(*tasks)

def get_films_data(user_queries):
    loop = asyncio.get_event_loop()
    if loop.is_running():
        return loop.run_until_complete(main(user_queries))
    else:
        return asyncio.run(main(user_queries))



# Function to generate wrapped data
def generate_data_wrapped(username, year_wanted):
    total_steps = 17
    current_step = 0

    def print_progress(step_desc):
        nonlocal current_step
        current_step += 1
        progress_percent = int((current_step / total_steps) * 100)
        print(f"[{progress_percent}%] Step {current_step}/{total_steps}: {step_desc}")

    # Step 1: Get the collections and prepare lookups
    user_diaries = db["user_diaries"]
    cast_data = db["cast_data"]
    crew_data = db["crew_data"]
    countries_data = db["countries_data"]
    languages_data = db["languages_data"]
    genres_data = db["genres_data"]
    photos = db["photos"]
    posters = db["posters"]

    posters = list(posters.find())
    poster_lookup = {p['query']: p['poster_url'] for p in posters}  # poster lookup
    primary_languages = list(languages_data.find(
        {"priority": "Primary"},
        {"query": 1, "Language": 1, "_id": 0}
    ))
    languages_lookup = {doc["query"]: doc["Language"] for doc in primary_languages}
    countries = list(countries_data.find())
    countries_lookup = {
        doc["query"]: {"country": doc["country"], "country_url": doc["country_url"]}
        for doc in countries
    }
    genres = list(genres_data.find())
    genres_lookup = {doc["query"]: doc["genre"] for doc in genres}
    print_progress("Collections loaded and lookups created.")

    # Step 2: Filter diary entries for the user and desired year
    if user_diaries.count_documents({"user": username}) > 0:
        user_diary = list(user_diaries.find({"user": username}))
        start_date = datetime.strptime(f"{year_wanted}-01-01", "%Y-%m-%d")
        end_date = datetime.strptime(f"{year_wanted}-12-31", "%Y-%m-%d")
        user_diary_year = [
            dic for dic in user_diary
            if start_date <= datetime.strptime(dic["viewing_date"], "%Y-%m-%d") <= end_date
        ]
    else:
        print("No diary entries found.")
        return {}
    print_progress("Filtered diary entries for the given year.")

    # Step 3: Get and attach film data for each unique diary query
    user_queries = list({d['query'] for d in user_diary_year})
    film_data = get_films_data(user_queries)
    film_lookup = {film['query']: film for film in film_data}
    for diary in user_diary_year:
        film = film_lookup.get(diary.get('query'))
        if film:
            diary.update(film)
    print_progress("Film data attached to diary entries.")

    # Step 4: Compute top 6 movies
    grouped = {}
    for entry in user_diary_year:
        q = entry['query']
        if q in grouped:
            if entry['viewing_date'] > grouped[q]['viewing_date']:
                grouped[q] = entry
        else:
            grouped[q] = entry
    top6_movies = heapq.nlargest(6, grouped.values(), key=lambda x: x.get('rating', 0))
    top6_movies = [
        {'user': entry.get('user'), 'query': entry.get('query'), 'rating': entry.get('rating')}
        for entry in top6_movies
    ]
    for entry in top6_movies:
        entry['poster_url'] = poster_lookup.get(entry['query'])
    for entry in top6_movies:
        entry["query"] = f"https://letterboxd.com/film/{entry['query']}/"
        entry["rating"] = convert_to_stars(entry["rating"])
        entry["film_url"] = entry.pop("query")
    print_progress("Top 6 movies determined.")

    # Step 5: Compute top 6 releases
    filtered_entries = [
        entry for entry in user_diary_year 
        if entry.get('release_date', '')[:4] == str(year_wanted)
    ]
    grouped = {}
    for entry in filtered_entries:
        q = entry['query']
        if q in grouped:
            if entry['viewing_date'] > grouped[q]['viewing_date']:
                grouped[q] = entry
        else:
            grouped[q] = entry
    top6_releases = heapq.nlargest(6, grouped.values(), key=lambda x: x.get('rating', 0))
    top6_releases = [
        {'user': entry.get('user'), 'query': entry.get('query'), 'rating': entry.get('rating')}
        for entry in top6_releases
    ]
    for entry in top6_releases:
        entry['poster_url'] = poster_lookup.get(entry['query'])
    for entry in top6_releases:
        entry["query"] = f"https://letterboxd.com/film/{entry['query']}/"
        entry["rating"] = convert_to_stars(entry["rating"])
        entry["film_url"] = entry.pop("query")
    print_progress("Top 6 releases determined.")

    # Step 6: Weekly summaries
    diary_entries_year = []
    for entry in user_diary_year:
        if entry.get('viewing_date', '')[:4] == str(year_wanted):
            try:
                d = datetime.strptime(entry['viewing_date'], "%Y-%m-%d").date()
            except ValueError:
                continue
            entry['_date_obj'] = d
            diary_entries_year.append(entry)
    diary_entries_year.sort(key=lambda e: e['_date_obj'])
    spanish_months = {
        1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"
    }
    year_start = date(year_wanted, 1, 1)
    year_end = date(year_wanted, 12, 31)
    weekly_summaries = []
    week_number = 1
    current_week_start = year_start
    days_to_sunday = 6 - current_week_start.weekday()
    current_week_end = current_week_start + timedelta(days=days_to_sunday)
    if current_week_end > year_end:
        current_week_end = year_end
    pointer = 0
    n_entries = len(diary_entries_year)
    default_user = diary_entries_year[0]['user'] if diary_entries_year else None

    while current_week_start <= year_end:
        week_entries = []
        while pointer < n_entries and diary_entries_year[pointer]['_date_obj'] < current_week_start:
            pointer += 1
        temp = pointer
        while temp < n_entries and diary_entries_year[temp]['_date_obj'] <= current_week_end:
            week_entries.append(diary_entries_year[temp])
            temp += 1
        pointer = temp
        valid_ratings = [entry['rating'] for entry in week_entries if entry.get('rating', 0) != 0]
        avg_weekly_rating = sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0
        weekly_quantity = len(week_entries)
        if current_week_start.month == current_week_end.month:
            week_range = f"{spanish_months[current_week_start.month]} {current_week_start.day}-{current_week_end.day}"
        else:
            week_range = f"{spanish_months[current_week_start.month]} {current_week_start.day}-{spanish_months[current_week_end.month]} {current_week_end.day}"
        week_summary = {
            'user': default_user,
            'week_number': week_number,
            'avg_weekly_rating': avg_weekly_rating,
            'weekly_quantity': weekly_quantity,
            'week_range': week_range,
            'week_label': f"Sem. {week_number}"
        }
        weekly_summaries.append(week_summary)
        week_number += 1
        next_week_start = current_week_end + timedelta(days=1)
        current_week_start = next_week_start
        current_week_end = current_week_start + timedelta(days=6)
        if current_week_end > year_end:
            current_week_end = year_end
    print_progress("Weekly summaries computed.")

    # Step 7: Daily stats
    weekday_labels = {0: 'Lu', 1: 'Ma', 2: 'Mi', 3: 'Ju', 4: 'Vi', 5: 'Sá', 6: 'Do'}
    day_stats = {i: {'count': 0, 'rating_total': 0, 'rating_count': 0} for i in range(7)}
    username = user_diary_year[0]['user'] if user_diary_year else None
    for entry in user_diary_year:
        try:
            date_obj = datetime.strptime(entry['viewing_date'], "%Y-%m-%d")
        except ValueError:
            continue
        day_index = date_obj.weekday()
        day_stats[day_index]['count'] += 1
        rating = entry.get('rating', 0)
        if rating != 0:
            day_stats[day_index]['rating_total'] += rating
            day_stats[day_index]['rating_count'] += 1
    day_summaries = []
    for day in range(7):
        total_entries = day_stats[day]['count']
        non_zero_count = day_stats[day]['rating_count']
        avg_rating = day_stats[day]['rating_total'] / non_zero_count if non_zero_count > 0 else 0
        day_summaries.append({
            'user': username,
            'day': weekday_labels[day],
            'count': total_entries,
            'rating': avg_rating
        })
    print_progress("Daily stats computed.")

    # Step 8: Releases proportion
    estrenos = 0
    viejas = 0
    total = 0
    for entry in user_diary_year:
        total += 1
        if entry.get('release_date', '')[:4] == str(year_wanted):
            estrenos += 1
        else:
            viejas += 1
    releases_proportion = [
        {'user': username, 'type_movie': 'Estrenos', 'movie_count': estrenos},
        {'user': username, 'type_movie': 'Viejas', 'movie_count': viejas},
        {'user': username, 'type_movie': 'Total',   'movie_count': total}
    ]
    print_progress("Releases proportion computed.")

    # Step 9: Ratings count
    ratings_possible = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
    rating_counts = {rating: 0 for rating in ratings_possible}
    for entry in user_diary_year:
        rating = entry.get('rating', 0)
        if rating in rating_counts:
            rating_counts[rating] += 1
    username = user_diary_year[0]['user'] if user_diary_year else None
    ratings_count = [
        {
            'user': username,
            'rating': rating,
            'rating_count': rating_counts[rating],
            'stars': convert_to_stars(rating)
        }
        for rating in ratings_possible
    ]
    print_progress("Ratings count computed.")

    # Step 10: Highest and lowest differences
    for entry in user_diary_year:
        rating = entry.get('rating', 0)
        avg_rating = entry.get('avg_rating', 0)
        entry['difference'] = 72 if rating == 0 else round(rating - avg_rating, 2)
    filtered_entries = [entry for entry in user_diary_year if entry['difference'] != 72]
    lowest_entries = heapq.nsmallest(6, filtered_entries, key=lambda x: x['difference'])
    highest_entries = heapq.nlargest(6, filtered_entries, key=lambda x: x['difference'])
    def transform_entry(entry):
        query = entry.get('query', '')
        return {
            'user': username,
            'poster_url': poster_lookup.get(query),
            'avg': "vs. " + str(entry['avg_rating']),
            'film_url': f"https://letterboxd.com/film/{query}/",
            'rating': convert_to_stars(entry.get('rating', 0)),
            'rating_num': entry.get('rating', 0),
            'avg_num': entry.get('avg_rating', 0)
        }
    lowest_diffs = [transform_entry(entry) for entry in lowest_entries]
    highest_diffs = [transform_entry(entry) for entry in highest_entries]
    print_progress("Highest & lowest differences computed.")

    # Step 11: Languages count & ratings
    for entry in user_diary_year:
        entry['language'] = languages_lookup.get(entry['query'])
    lang_counts = {}
    lang_rating_sum = {}
    lang_rating_count = {}
    for entry in user_diary_year:
        lang = entry.get('language')
        if lang is None:
            continue
        lang_counts[lang] = lang_counts.get(lang, 0) + 1
        rating = entry.get('rating', 0)
        if rating != 0:
            lang_rating_sum[lang] = lang_rating_sum.get(lang, 0) + rating
            lang_rating_count[lang] = lang_rating_count.get(lang, 0) + 1
    top_counts = sorted(lang_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    languages_counts = [
        {'user': username, 'language': lang, 'watch_count': count}
        for lang, count in top_counts
    ]
    lang_avg = {}
    for lang, total in lang_rating_sum.items():
        count = lang_rating_count.get(lang, 0)
        if count >= 2:
            lang_avg[lang] = total / count
    top_ratings = sorted(lang_avg.items(), key=lambda item: item[1], reverse=True)[:10]
    languages_ratings = [
        {'user': username, 'language': lang, 'avg_user_rating': avg}
        for lang, avg in top_ratings
    ]
    print_progress("Languages count & ratings computed.")

    # Step 12: Genres count & ratings
    for entry in user_diary_year:
        entry['genre'] = genres_lookup.get(entry['query'])
    genres_counts = {}
    genres_rating_sum = {}
    genres_rating_count = {}
    for entry in user_diary_year:
        gen = entry.get('genre')
        if gen is None:
            continue
        genres_counts[gen] = genres_counts.get(gen, 0) + 1
        rating = entry.get('rating', 0)
        if rating != 0:
            genres_rating_sum[gen] = genres_rating_sum.get(gen, 0) + rating
            genres_rating_count[gen] = genres_rating_count.get(gen, 0) + 1
    top_counts = sorted(genres_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    genres_counts = [
        {'user': username, 'genre': gen, 'watch_count': count}
        for gen, count in top_counts
    ]
    genre_avg = {}
    for gen, total in genres_rating_sum.items():
        count = genres_rating_count.get(gen, 0)
        if count >= 2:
            genre_avg[gen] = total / count
    top_ratings = sorted(genre_avg.items(), key=lambda item: item[1], reverse=True)[:10]
    genres_ratings = [
        {'user': username, 'genre': gen, 'avg_user_rating': avg}
        for gen, avg in top_ratings
    ]
    print_progress("Genres count & ratings computed.")

    # Step 13: Countries list, count & ratings
    country_aggregator = {}
    for entry in user_diary_year:
        query = entry.get("query")
        country_info = countries_lookup.get(query, {"country": None, "country_url": None})
        entry["country"] = country_info["country"]
        entry["country_url"] = country_info["country_url"]
        if not entry["country"]:
            continue
        country = entry["country"]
        if country not in country_aggregator:
            country_aggregator[country] = {
                "watch_count": 0,
                "rating_sum": 0,
                "rating_count": 0,
                "country_url": entry["country_url"]
            }
        country_aggregator[country]["watch_count"] += 1
        rating = entry.get("rating", 0)
        if rating != 0:
            country_aggregator[country]["rating_sum"] += rating
            country_aggregator[country]["rating_count"] += 1
    all_countries = []
    for country, stats in country_aggregator.items():
        avg_user_rating = stats["rating_sum"] / stats["rating_count"] if stats["rating_count"] > 0 else 0
        all_countries.append({
            "country": country,
            "watch_count": stats["watch_count"],
            "avg_user_rating": avg_user_rating,
            "country_url": stats["country_url"]
        })
    countries_counts = heapq.nlargest(10, all_countries, key=lambda d: d["watch_count"])
    filtered_countries = [d for d in all_countries if d["watch_count"] >= 2]
    countries_ratings = heapq.nlargest(10, filtered_countries, key=lambda d: d["avg_user_rating"])
    print_progress("Countries list, count & ratings computed.")

    # Step 14: High & Low stats
    def format_vote_count(vc):
        if 1000 <= vc <= 999999:
            val = vc / 1000
            return f"{val:.2f} k"
        elif vc > 999999:
            val = vc / 1000000
            return f"{val:.2f} mill."
        else:
            return str(vc)
    username = user_diary_year[0]['user'] if user_diary_year else None
    dict1_entry = max(user_diary_year, key=lambda x: x.get('avg_rating', 0))
    dict1 = {
        "poster_url": poster_lookup.get(dict1_entry.get('query')),
        "user": username,
        "hi_low_labels": "Prom. más alto",
        "value_labels": f"{dict1_entry.get('avg_rating', 0)} ★"
    }
    avg_filtered = [entry for entry in user_diary_year if entry.get('avg_rating', 0) != 0]
    dict2_entry = min(avg_filtered, key=lambda x: x.get('avg_rating', 0)) if avg_filtered else None
    dict2 = {
        "poster_url": poster_lookup.get(dict2_entry.get('query')),
        "user": username,
        "hi_low_labels": "Prom. más bajo",
        "value_labels": f"{dict2_entry.get('avg_rating', 0)} ★"
    } if dict2_entry else {}
    dict3_entry = max(user_diary_year, key=lambda x: x.get('vote_count', 0))
    dict3 = {
        "poster_url": poster_lookup.get(dict3_entry.get('query')),
        "user": username,
        "hi_low_labels": "Más popular",
        "value_labels": format_vote_count(dict3_entry.get('vote_count', 0))
    }
    vote_filtered = [entry for entry in user_diary_year if entry.get('vote_count', 0) != 0]
    dict4_entry = min(vote_filtered, key=lambda x: x.get('vote_count', 0)) if vote_filtered else None
    dict4 = {
        "poster_url": poster_lookup.get(dict4_entry.get('query')),
        "user": username,
        "hi_low_labels": "Menos popular",
        "value_labels": format_vote_count(dict4_entry.get('vote_count', 0))
    } if dict4_entry else {}
    dict5_entry = max(user_diary_year, key=lambda x: x.get('total_minutes', 0))
    dict5 = {
        "poster_url": poster_lookup.get(dict5_entry.get('query')),
        "user": username,
        "hi_low_labels": "Más larga",
        "value_labels": f"{dict5_entry.get('total_minutes', 0)} min."
    }
    minutes_filtered = [entry for entry in user_diary_year if entry.get('total_minutes', 0) != 0]
    dict6_entry = min(minutes_filtered, key=lambda x: x.get('total_minutes', 0)) if minutes_filtered else None
    dict6 = {
        "poster_url": poster_lookup.get(dict6_entry.get('query')),
        "user": username,
        "hi_low_labels": "Más corta",
        "value_labels": f"{dict6_entry.get('total_minutes', 0)} min."
    } if dict6_entry else {}
    high_low_data = [dict1, dict2, dict3, dict4, dict5, dict6]
    print_progress("High & Low stats computed.")

    # Step 15: Display stats
    diary_logs = len(user_diary_year)
    rewatchs = sum(entry.get("rewatch", 0) for entry in user_diary_year)
    total_minutes = sum(entry.get("total_minutes", 0) for entry in user_diary_year)
    hours_watched = round(total_minutes / 60, 1)
    display_stats = [{
        "user": username,
        "diary_logs": diary_logs,
        "rewatchs": rewatchs,
        "hours_watched": hours_watched
    }]
    print_progress("Display stats computed.")

    # Step 16: Cast & crew rated data process
    queries_list = list({entry["query"] for entry in user_diary_year})
    filtered_cast_data = list(cast_data.find({"query": {"$in": queries_list}}))
    filtered_crew_data = list(crew_data.find({"query": {"$in": queries_list}}))
    best_entry_by_query = {}
    for entry in user_diary_year:
        q = entry.get("query")
        if q not in best_entry_by_query:
            best_entry_by_query[q] = entry
        else:
            current = best_entry_by_query[q]
            if entry["viewing_date"] > current["viewing_date"]:
                best_entry_by_query[q] = entry
            elif entry["viewing_date"] == current["viewing_date"]:
                if entry.get("extraction_order", 0) > current.get("extraction_order", 0):
                    best_entry_by_query[q] = entry
    for doc in filtered_cast_data:
        q = doc.get("query")
        doc["user_rating"] = best_entry_by_query.get(q, {}).get("rating", 0)
    for doc in filtered_crew_data:
        q = doc.get("query")
        doc["user_rating"] = best_entry_by_query.get(q, {}).get("rating", 0)
    cast_groups = {}
    for doc in filtered_cast_data:
        url = doc.get("url")
        if not url:
            continue
        if url not in cast_groups:
            cast_groups[url] = {
                "name": doc.get("name"),
                "person_lboxd_url": url,
                "user_ratings": [],
                "watch_count": 0
            }
        cast_groups[url]["watch_count"] += 1
        rating = doc.get("user_rating", 0)
        if rating != 0:
            cast_groups[url]["user_ratings"].append(rating)
    cast_aggregated = []
    for url, group in cast_groups.items():
        avg_rating = (sum(group["user_ratings"]) / len(group["user_ratings"])
                      if group["user_ratings"] else 0)
        cast_aggregated.append({
            "name": group["name"],
            "person_lboxd_url": group["person_lboxd_url"],
            "avg_user_rating": avg_rating,
            "watch_count": group["watch_count"]
        })
    crew_groups = {}
    for doc in filtered_crew_data:
        url = doc.get("url")
        job = doc.get("job")
        if not url or not job:
            continue
        key = (url, job)
        if key not in crew_groups:
            crew_groups[key] = {
                "name": doc.get("name"),
                "person_lboxd_url": url,
                "job": job,
                "user_ratings": [],
                "watch_count": 0
            }
        crew_groups[key]["watch_count"] += 1
        rating = doc.get("user_rating", 0)
        if rating != 0:
            crew_groups[key]["user_ratings"].append(rating)
    crew_aggregated = []
    for (url, job), group in crew_groups.items():
        avg_rating = (sum(group["user_ratings"]) / len(group["user_ratings"])
                      if group["user_ratings"] else 0)
        crew_aggregated.append({
            "name": group["name"],
            "person_lboxd_url": group["person_lboxd_url"],
            "job": group["job"],
            "avg_user_rating": avg_rating,
            "watch_count": group["watch_count"]
        })
    actors_rated = [d for d in cast_aggregated if d.get("watch_count", 0) >= 2]
    actors_rated = heapq.nlargest(5, actors_rated, key=lambda d: d.get("avg_user_rating", 0))
    actors_watched = heapq.nlargest(5, cast_aggregated, key=lambda d: d.get("watch_count", 0))
    crew_directors = [d for d in crew_aggregated if d.get("job") in ("Director", "Directors")]
    directors_rated = [d for d in crew_directors if d.get("watch_count", 0) >= 2]
    directors_rated = heapq.nlargest(5, directors_rated, key=lambda d: d.get("avg_user_rating", 0))
    directors_watched = heapq.nlargest(5, crew_directors, key=lambda d: d.get("watch_count", 0))
    unique_lboxd_urls = set()
    for lst in (actors_rated, actors_watched, directors_rated, directors_watched):
        for d in lst:
            url = d.get("person_lboxd_url")
            if url:
                unique_lboxd_urls.add(url)
    unique_lboxd_urls = list(unique_lboxd_urls)
    photos_docs = list(photos.find({"name_query": {"$in": unique_lboxd_urls}}))
    photos_lookup = {doc["name_query"]: doc["url"] for doc in photos_docs}
    for lst in (actors_rated, actors_watched, directors_rated, directors_watched):
        for d in lst:
            d["url"] = photos_lookup.get(d.get("person_lboxd_url"))
    print_progress("Cast & crew data processed.")

    # Step 17: Combine all results and finish
    data = {
        "top6_movies": top6_movies,
        "top6_releases": top6_releases,
        "weekly_summaries": weekly_summaries,
        "day_summaries": day_summaries,
        "releases_proportion": releases_proportion,
        "ratings_count": ratings_count,
        "lowest_diffs": lowest_diffs,
        "highest_diffs": highest_diffs,
        "languages_counts": languages_counts,
        "languages_ratings": languages_ratings,
        "genres_counts": genres_counts,
        "genres_ratings": genres_ratings,
        "all_countries": all_countries,
        "countries_counts": countries_counts,
        "countries_ratings": countries_ratings,
        "high_low_data": high_low_data,
        "display_stats": display_stats,
        "actors_rated": actors_rated,
        "actors_watched": actors_watched,
        "directors_rated": directors_rated,
        "directors_watched": directors_watched,
    }
    print_progress("All data aggregated. Processing complete.")
    return data

