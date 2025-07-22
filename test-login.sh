# Test Login API using cURL

# 1. Valid Login
echo "Testing valid login..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ziohelp.com","password":"password123"}'

# 2. Invalid Password
echo "\n\nTesting invalid password..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ziohelp.com","password":"wrongpassword"}'

# 3. Invalid Email
echo "\n\nTesting invalid email..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@ziohelp.com","password":"password123"}'

# 4. Empty Password
echo "\n\nTesting empty password..."
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ziohelp.com","password":""}'
