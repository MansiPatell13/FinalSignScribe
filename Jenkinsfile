
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
        }
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Deploy to Firebase') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([file(credentialsId: 'firebase-service-account', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    sh 'npm install -g firebase-tools'
                    sh 'firebase deploy --token "$FIREBASE_TOKEN" --non-interactive'
                }
            }
        }
        
        stage('Build Docker Image') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker build -t signscribe:latest .'
                sh 'docker tag signscribe:latest your-registry/signscribe:latest'
                sh 'docker push your-registry/signscribe:latest'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed!'
        }
    }
}
