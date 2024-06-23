from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Note(db.Model):
    __tablename__ = 'note'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text)
    is_active = db.Column(db.Boolean(), default=True)
    categories = db.relationship('Category', secondary='note_category', backref='notes')

    def __repr__(self):
        return 'Note with id {} and title {}'.format(self.id, self.title)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "is_active": self.is_active,
            "categories": [category.serialize() for category in self.categories],  # Serialize categorries
        }
    
class Category(db.Model):
    __tablename__='category'
    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(25), nullable=False)
    color = db.Column(db.String(20))

    def __repr__(self):
        return 'Category with id {} and name {}'.format(self.id, self.category_name)

    def serialize(self):
        return {
            "id": self.id,
            "category_name": self.category_name,
            "color": self.color,
        }

class NoteCategory(db.Model):
    __tablename__='note_category'
    id = db.Column(db.Integer, primary_key=True)
    note_id = db.Column(db.Integer, db.ForeignKey('note.id'), nullable=False)
    note_relationship = db.relationship(Note)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category_relationship = db.relationship(Category)

    def __repr__(self):

        return 'Note category with id {}, note with id {}, and category with id {}'.format(self.id, self.note_id, self.category_id)
    def serialize(self):
        return {
            "id": self.id,
            "note_id": self.note_id,
            "category_id": self.category_id
        }
