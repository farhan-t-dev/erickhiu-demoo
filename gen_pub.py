from flask import Flask, render_template, jsonify
import os
import json

app = Flask(__name__)

# Load publications data from JSON
def load_publications():
    with open('data/publications.json') as f:
        return json.load(f)['publications']

# Home page displaying list of publications
@app.route('/publications')
def index():
    publications = load_publications()
    return render_template('publications.html', publications=publications)

# Dynamic route for individual publications
@app.route('/publications/<int:pub_id>')
def publication(pub_id):
    publications = load_publications()
    publication = next((pub for pub in publications if pub['pub_id'] == pub_id), None)
    if publication:
        return render_template('publication_item.html', publication=publication)
    else:
        return "Publication not found", 404

if __name__ == '__main__':
    app.run(debug=True)
