"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from backend.models import db, Note, Category, NoteCategory
from backend.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

##############################################################
#Note Routes

#Gets all notes
@api.route('/note', methods=['GET'])
def get_all_notes():
    notes = Note.query.all()
    serialized_notes = list(map(lambda item: item.serialize(), notes))
    return jsonify({'msg': 'Ok', 'results': serialized_notes}), 200

#Get a particular note from its id
@api.route('/note/<int:note_id>', methods=['GET'])
def get_particular_note(note_id):
    note = Note.query.get(note_id)
    if note is None:
        return ({'msg': 'The note with id {} does not exist'.format(note_id)}), 404
    serialized_note = note.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_note}), 200

#Create a new note
@api.route('/note', methods=['POST'])
def add_new_note():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg" : "You must send information in the body"}), 400
    if "title" not in body:
        return jsonify({"msg" : "The title field is obligatory"}), 400
        
    title = body.get("title")
    content = body.get("content", "")
    is_active = body.get("is_active", True)
    category_ids = body.get("category_ids", [])

    new_note = Note(title=title, content=content, is_active=is_active)
    db.session.add(new_note)
    db.session.commit()

    for category_id in category_ids:
        category = Category.query.get(category_id)
        if category:
            note_category = NoteCategory(note_id=new_note.id, category_id=category.id)
            db.session.add(note_category)

    db.session.commit()

    serialized_note = new_note.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_note}), 201

# Update an existing note
@api.route('/note/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    note = Note.query.get(note_id)
    if note is None:
        return jsonify({'msg': 'The note with id {} does not exist'.format(note_id)}), 404

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "You must send information in the body"}), 400

    if "title" in body:
        note.title = body.get("title", note.title)
    if "content" in body:
        note.content = body.get("content", note.content)
    if "is_active" in body:
        note.is_active = body.get("is_active", note.is_active)
    if "categories" in body:
        # Clear existing categories
        note.categories.clear()
        new_categories = body.get("categories", [])
        
        for category_data in new_categories:
            category_id = category_data.get("id")
            category = Category.query.get(category_id)
            if category:
                note.categories.append(category)

    db.session.commit()

    serialized_note = note.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_note}), 200

# Delete a particular note
@api.route('/note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Note.query.get(note_id)
    if note is None:
        return jsonify({'msg': 'The note with id {} does not exist'.format(note_id)}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({'msg': 'The note with id {} has been correctly deleted'.format(note_id)}), 200


##############################################################
#Category Routes

#Gets all categories
@api.route('/category', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    serialized_categories = list(map(lambda item: item.serialize(), categories))
    return jsonify({'msg': 'Ok', 'results': serialized_categories}), 200

#Get a particular category from its id
@api.route('/category/<int:category_id>', methods=['GET'])
def get_particular_category(category_id):
    category = Category.query.get(category_id)
    if category is None:
        return ({'msg': 'The category with id {} does not exist'.format(category_id)}), 404
    serialized_category = category.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_category}), 200


#Create a new category
@api.route('/category', methods=['POST'])
def add_new_category():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg" : "You must send information in the body"}), 400
    if "category_name" not in body:
        return jsonify({"msg" : "The category name field is obligatory"}), 400
        
    category_name = body.get("category_name")
    color = body.get("color")

    new_category = Category(category_name=category_name, color=color)
    db.session.add(new_category)
    db.session.commit()

    serialized_category = new_category.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_category}), 201

# Update an existing category
@api.route('/category/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category = Category.query.get(category_id)
    if category is None:
        return jsonify({'msg': 'The category with id {} does not exist'.format(category_id)}), 404

    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "You must send information in the body"}), 400

    if "category_name" in body:
        category.category_name = body.get("category_name", category.category_name)
    if "color" in body:
        category.color = body.get("color", category.color)

    db.session.commit()

    serialized_category = category.serialize()
    return jsonify({'msg': 'Ok', 'results': serialized_category}), 200

# Delete a particular category
@api.route('/category/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    category = Category.query.get(category_id)
    if category is None:
        return jsonify({'msg': 'The category with id {} does not exist'.format(category_id)}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({'msg': 'The category with id {} has been correctly deleted'.format(category_id)}), 200
