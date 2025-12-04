import csv
import os
import uuid
from flask import Flask, jsonify, request, send_from_directory
from flasgger import Swagger, swag_from
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Define reusable schemas
item_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "string", "description": "Product ID"},
        "price": {"type": "integer", "description": "Price in cents"},
        "quantity": {"type": "integer", "description": "Number of items"}
    },
    "required": ["id", "quantity"]
}

cart_schema = {
    "type": "object",
    "properties": {
        "cart_id": {"type": "string"},
        "items": {
            "type": "array",
            "items": item_schema
        }
    }
}

# Only enable Swagger in development mode
if os.environ.get('FLASK_ENV') == 'development':
    swagger = Swagger(app)

def load_products():
    products = {}
    with open('data/products.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            products[row['id']] = {
                'name': row['name'],
                'price': int(row['price']),
                'image_url': row['image_url'],
                'description': row['description']
            }
    return products

products_db = load_products()
shopping_carts = {}
flag_capture_count = 0

@app.route('/api/admin/flag-captures', methods=['GET'])
@swag_from({
    'tags': ['Admin'],
    'summary': 'Gets the number of times the flag has been captured.',
    'responses': {
        '200': {
            'description': 'The current count of flag captures.',
            'schema': {
                'type': 'object',
                'properties': {
                    'capture_count': {'type': 'integer'}
                }
            }
        }
    }
})
def get_flag_captures():
    return jsonify({'capture_count': flag_capture_count})

@app.route('/api/admin/carts', methods=['GET'])
@swag_from({
    'tags': ['Admin'],
    'summary': 'Lists all currently active shopping carts.',
    'responses': {
        '200': {
            'description': 'A list of all shopping carts.',
            'schema': {
                'type': 'array',
                'items': cart_schema
            }
        }
    }
})
def get_all_carts():
    # Convert the dictionary of carts into a list of objects
    cart_list = [{'cart_id': cid, 'items': items} for cid, items in shopping_carts.items()]
    return jsonify(cart_list)

@app.route('/api/admin/reset', methods=['POST'])
@swag_from({
    'tags': ['Admin'],
    'summary': 'Resets all user-generated data (shopping carts and flag count).',
    'responses': {
        '200': {
            'description': 'Server state has been reset.',
            'schema': {
                'type': 'object',
                'properties': {'message': {'type': 'string'}}
            }
        }
    }
})
def reset_server_state():
    global shopping_carts, flag_capture_count
    shopping_carts = {}
    flag_capture_count = 0
    return jsonify({'message': 'Server state has been reset.'}), 200

@app.route('/api/admin/reload', methods=['POST'])
@swag_from({
    'tags': ['Admin'],
    'summary': 'Reloads the product database from the CSV file.',
    'responses': {
        '200': {
            'description': 'Product database has been reloaded.',
            'schema': {
                'type': 'object',
                'properties': {'message': {'type': 'string'}}
            }
        },
        '500': {'description': 'Failed to reload products.'}
    }
})
def reload_products_endpoint():
    global products_db
    try:
        products_db = load_products()
        return jsonify({'message': 'Product database has been reloaded.'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to reload products: {str(e)}'}), 500

@app.route('/api/images/<path:filename>')
@swag_from({
    'tags': ['Products'],
    'summary': 'Serves a product image.',
    'parameters': [{
        'name': 'filename', 'in': 'path', 'type': 'string',
        'required': True, 'description': 'The filename of the image to retrieve.'
    }],
    'responses': {
        '200': {'description': 'The image file.', 'schema': {'type': 'file'}}
    }
})
def serve_image(filename):
    return send_from_directory(os.path.join(app.root_path, 'data/images'), filename)

@app.route('/api/products', methods=['GET'])
@swag_from({
    'tags': ['Products'],
    'summary': 'Retrieves the list of all available products.',
    'responses': {
        '200': {
            'description': 'A list of products.',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'string'},
                        'name': {'type': 'string'},
                        'price': {'type': 'integer'},
                        'image_url': {'type': 'string'},
                        'description': {'type': 'string'}
                    }
                }
            }
        }
    }
})
def get_products():
    product_list = [{'id': pid, **pdetails} for pid, pdetails in products_db.items()]
    return jsonify(product_list)

@app.route('/api/cart', methods=['POST'])
@swag_from({
    'tags': ['Cart'],
    'summary': 'Creates a new, empty shopping cart.',
    'responses': {
        '201': {
            'description': 'The cart was created successfully.',
            'schema': cart_schema
        }
    }
})
def create_cart():
    cart_id = str(uuid.uuid4())
    shopping_carts[cart_id] = []
    return jsonify({'cart_id': cart_id, 'items': []}), 201

@app.route('/api/cart/<string:cart_id>', methods=['PUT'])
@swag_from({
    'tags': ['Cart'],
    'summary': 'Updates an existing shopping cart with a list of items.',
    'parameters': [
        {'name': 'cart_id', 'in': 'path', 'type': 'string', 'required': True, 'description': 'The ID of the cart to update.'},
        {'name': 'body', 'in': 'body', 'required': True, 'schema': {
            'type': 'object',
            'properties': {'items': {'type': 'array', 'items': item_schema}},
            'additionalProperties': True
        }}
    ],
    'responses': {
        '200': {'description': 'The cart was updated successfully.', 'schema': cart_schema},
        '400': {'description': 'Price for a product does not match.'},
        '404': {'description': 'Cart not found or product not found.'}
    }
})
def update_cart(cart_id):
    if cart_id not in shopping_carts:
        return jsonify({'error': 'Cart not found'}), 404

    cart_items = request.json.get('items', [])
    for item in cart_items:
        product_id = str(item.get('id'))
        if product_id not in products_db:
            return jsonify({'error': f'Product with id {product_id} not found'}), 404
        if int(item.get('price')) != products_db[product_id]['price']:
            return jsonify({'error': f'Price for product {product_id} does not match'}), 400

    shopping_carts[cart_id] = cart_items
    return jsonify({'cart_id': cart_id, 'items': cart_items})

@app.route('/api/cart/<string:cart_id>/checkout', methods=['POST'])
@swag_from({
    'tags': ['Cart'],
    'summary': 'Processes the checkout for a specific cart.',
    'parameters': [
        {'name': 'cart_id', 'in': 'path', 'type': 'string', 'required': True, 'description': 'The ID of the cart to check out.'},
        {'name': 'body', 'in': 'body', 'required': False, 'schema': {
            'type': 'object',
            'properties': {'items': {'type': 'array', 'items': item_schema}},
            'additionalProperties': True
        }}
    ],
    'responses': {
        '200': {
            'description': 'Checkout successful.',
            'schema': {
                'type': 'object',
                'properties': {
                    'total_price': {'type': 'integer'},
                    'items': {'type': 'array', 'items': item_schema},
                    'ctf_flag': {'type': 'string', 'description': 'Only present if total_price is negative.'}
                }
            }
        },
        '400': {'description': 'Cart cannot be empty.'},
        '404': {'description': 'Cart not found or product in cart not found.'}
    }
})
def checkout(cart_id):
    if cart_id not in shopping_carts:
        return jsonify({'error': 'Cart not found'}), 404

    # Use items from request if provided, otherwise use the cart stored on the server
    if request.is_json and 'items' in request.json:
        cart_items = request.json.get('items')
    else:
        cart_items = shopping_carts[cart_id]

    if not cart_items:
        return jsonify({'error': 'Cart cannot be empty'}), 400

    total_price = 0
    for item in cart_items:
        product_id = str(item.get('id'))
        if product_id not in products_db:
            return jsonify({'error': f'Product with id {product_id} not found'}), 404
        
        # Use the price from the item if provided, otherwise fall back to the database price.
        total_price += int(item.get('price', products_db[product_id]['price'])) * int(item.get('quantity', 1))

    response_data = {'total_price': total_price, 'items': cart_items}
    if total_price < 0:
        global flag_capture_count
        flag_capture_count += 1
        ctf_flag = os.environ.get('CTF_FLAG', 'someone_forgot_to_set_it')
        response_data['ctf_flag'] = ctf_flag

    # Clear the cart after checkout
    del shopping_carts[cart_id]

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
