from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Define Recipe model
class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    site_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(64), nullable=False)
    minutes = db.Column(db.Integer, nullable=False)
    tags = db.Column(db.String(1024), nullable=False)
    description = db.Column(db.String(1024), nullable=False)
    ingredients = db.Column(db.String(1024), nullable=False)

    def __repr__(self):
        return f'Recipe {self.id}: {self.name}'