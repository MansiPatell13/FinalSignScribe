
# SignScribe Application

A React application for sign language translation using Firebase for authentication, storage, and hosting.

## Features

- User authentication (Email/Password and GitHub)
- Sign language translation
- Profile management
- Containerized deployment with Docker and Kubernetes
- Automated CI/CD with GitHub Actions
- Backup and recovery for Firebase Firestore

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account
- GitHub account (for authentication)
- Docker (for containerization)
- kubectl (for Kubernetes deployment)

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/signscribe.git
cd signscribe
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**
   
   - Create a new project in the [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and GitHub)
   - Enable Firestore Database
   - Enable Storage
   - Register a web app and get your Firebase config
   - Update the `src/integrations/firebase/client.ts` file with your Firebase config

4. **Set up GitHub Authentication**
   
   - Go to your GitHub account settings
   - Navigate to Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set the Authorization callback URL to: `https://your-firebase-project-id.firebaseapp.com/__/auth/handler`
   - Get your Client ID and Client Secret
   - Add these to your Firebase console under Authentication > Sign-in method > GitHub

5. **Generate self-signed SSL certificate for development**

```bash
mkdir certificates
cd certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
cd ..
```

6. **Start the development server**

```bash
npm run dev
```

The application will be available at `https://localhost:8080`.

### Production Deployment

#### Firebase Hosting

1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
firebase login
```

3. **Initialize Firebase in your project**

```bash
firebase init
```

4. **Build the application**

```bash
npm run build
```

5. **Deploy to Firebase**

```bash
firebase deploy
```

#### Docker Deployment

1. **Build the Docker image**

```bash
docker build -t signscribe:latest .
```

2. **Run the Docker container**

```bash
docker run -p 8080:80 signscribe:latest
```

#### Kubernetes Deployment

1. **Apply the Kubernetes configuration**

```bash
kubectl apply -f kubernetes/deployment.yaml
```

### Backup and Recovery

#### Manual Backup

1. **Download your Firebase service account key** from Project Settings > Service accounts
2. **Place the JSON file** in the project root and rename it to `serviceAccountKey.json`
3. **Run the backup script**

```bash
node scripts/firestore-backup.js
```

#### Manual Restoration

1. **Run the restore script**

```bash
node scripts/firestore-restore.js
```

2. **Follow the prompts** to select a backup to restore

#### Automated Backup (using cron)

Add a cron job to run the backup script periodically:

```bash
0 2 * * * cd /path/to/project && node scripts/firestore-backup.js >> /path/to/logs/backup.log 2>&1
```

This will run a backup every day at 2 AM.

## GitHub Actions CI/CD

The project includes a GitHub Actions workflow in `.github/workflows/firebase-deploy.yml` that automatically deploys to Firebase when changes are pushed to the main branch.

To use this workflow:

1. Add your Firebase service account as a GitHub secret named `FIREBASE_SERVICE_ACCOUNT`
2. Update the `projectId` in the workflow file to match your Firebase project ID

## License

[MIT](LICENSE)
