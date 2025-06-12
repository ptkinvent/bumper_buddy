# Bumper Buddy Web App

## Development
In one terminal, start npm to compile the frontend:
```
cd frontend/
npm install
npm run start
```

In another terminal, start Django to serve the backend:
```
sudo apt install python3-pip -y
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

## Deployment
1. If db migration is involved, run:
`python manage.py migrate`

2. If frontend jsx needs to be compiled, run:
`npm run build`

3. If staticfiles have changed (js, css, images, etc.), run:
`python manage.py collectstatic`

4. If any frontend or backend files have changed, run:
`sudo systemctl restart supervisor`
