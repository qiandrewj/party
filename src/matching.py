from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD


# Builds a TF-IDF index for recipes or playlists
def build_tfidf_index(data, data_set_category):
    if data_set_category == "recipe":
        corpus = [
        f"{d.name} {d.description} {d.tags} {d.ingredients}"
        for d in data
        ]
        min_df = 10 if len(corpus) >= 10 else 1
        vectorizer = TfidfVectorizer(
            max_features=5000, stop_words='english', max_df=0.8, min_df=min_df, norm='l2')
        if len(corpus) == 0:
            return None, None
        doc_by_vocab = vectorizer.fit_transform(corpus)
        return vectorizer, doc_by_vocab

    elif data_set_category == "playlist":
        name_corpus = [d.name for d in data]
        song_corpus = [d.songs for d in data]

        name_vectorizer = TfidfVectorizer(
            max_features=5000, stop_words='english', max_df=0.8, min_df=2, norm='l2')
        song_vectorizer = TfidfVectorizer(
            max_features=5000, stop_words='english', max_df=0.8, min_df=10, norm='l2')

        name_vecs = name_vectorizer.fit_transform(name_corpus)
        song_vecs = song_vectorizer.fit_transform(song_corpus)
        return (name_vectorizer, song_vectorizer), (name_vecs, song_vecs)

# Fits TF-IDF on recipe corpus and runs SVD to get latent dimensions
def build_svd_index(recipes, n_components=100):
    corpus = [
        f"{r.name} {r.description} {r.tags} {r.ingredients}"
        for r in recipes
    ]
    if len(corpus) == 0:
        return None, None

    min_df = 10 if len(corpus) >= 10 else 1
    vectorizer = TfidfVectorizer(
        max_features=5000, stop_words='english', max_df=0.8, min_df=min_df, norm='l2')
    tfidf_matrix = vectorizer.fit_transform(corpus)

    n_components = min(n_components, tfidf_matrix.shape[1] - 1)
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    svd.fit(tfidf_matrix)

    return vectorizer, svd


# Computes cosine-similarities between recipes and query vector
def query_data(query, data, data_set_category, vectorizer, doc_by_vocab, name_weight):
    matches = []
    if data_set_category == "recipe":
        query_vec = vectorizer.transform([query])
        scores = cosine_similarity(query_vec, doc_by_vocab).flatten()
        for i, score in enumerate(scores):
            link_suffix = data[i].name.lower().replace(' ', '-') + '-' + str(data[i].site_id)
            reconstructed_link = "https://www.food.com/recipe/" + link_suffix
            matches.append(({
                'name': data[i].name,
                'description': data[i].description,
                'minutes': data[i].minutes,
                'ingredients': data[i].ingredients,
                'link': reconstructed_link,
            }, float(score)))

    elif data_set_category == "playlist":
        name_vectorizer, song_vectorizer = vectorizer
        name_vecs, song_vecs = doc_by_vocab

        name_query = name_vectorizer.transform([query])
        song_query = song_vectorizer.transform([query])

        name_scores = cosine_similarity(name_query, name_vecs).flatten()
        song_scores = cosine_similarity(song_query, song_vecs).flatten()

        scores = name_weight * name_scores + (1 - name_weight) * song_scores

        for i, score in enumerate(scores):
            matches.append(({
                'name': data[i].name,
                'songs': data[i].songs,
                'artist': data[i].artists,
            }, float(score)))

    matches.sort(key=lambda x: x[1], reverse=True)
    list_desc = [x[0] for x in matches]
    return list_desc

def query_svd(query, playlists, vectorizer, svd):
    # project query into recipe latent space
    query_tfidf = vectorizer.transform([query])
    query_vec = svd.transform(query_tfidf)

    # project each playlist's enriched_text into the same latent space
    playlist_corpus = [p.enriched_text or "" for p in playlists]
    playlist_tfidf = vectorizer.transform(playlist_corpus)
    playlist_vecs = svd.transform(playlist_tfidf)

    # cosine similarity in latent space
    scores = cosine_similarity(query_vec, playlist_vecs).flatten()

    matches = []
    for i, score in enumerate(scores):
        matches.append(({
            'name': playlists[i].name,
            'songs': playlists[i].songs,
            'artist': playlists[i].artists,
        }, float(score)))

    matches.sort(key=lambda x: x[1], reverse=True)
    return [x[0] for x in matches]
