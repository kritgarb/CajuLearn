from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import datetime
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Troque para uma chave segura em produção
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(hours=1)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)  # Permite que o frontend (client) se comunique com o backend

# Simulando um banco de dados com um dicionário
users_db = {}

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if email in users_db:
        return jsonify({'message': 'Usuário já registrado!'}), 400

    # Criptografar a senha
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_db[email] = {'password': hashed_password, 'role': role}
    return jsonify({'message': f'Usuário {email} registrado com sucesso!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_db.get(email)
    if user and bcrypt.check_password_hash(user['password'], password):
        # Criar token JWT
        access_token = create_access_token(identity={'email': email, 'role': user['role']})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({'message': 'Credenciais inválidas!'}), 401

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Bem-vindo à sua dashboard, {current_user["email"]}!', 'role': current_user['role']}), 200

if __name__ == '__main__':
    app.run(debug=True)
