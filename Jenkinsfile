pipeline {
    agent any
    environment {
        AWS_ACCESS_KEY_ID = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        AWS_DEFAULT_REGION = "us-east-2"
        DOCKER_IMAGE = "bhanuakepogu/docker-react"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Verify Docker') {
            steps {
                sh 'docker --version'
            }
        }


        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${DOCKER_IMAGE} -f Dockerfile.dev ."
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo "Running tests..."
                    sh "docker run ${DOCKER_IMAGE} npm run test -- --coverage"
                }
            }
        }

        stage('Install AWS CLI & EB CLI') {
            steps {
                script {
                    echo "Installing AWS and Elastic Beanstalk CLI..."
                    sh '''
                       # Install dependencies if necessary (using sudo apt-get requires permissions)
                       # sudo apt-get update && sudo apt-get install -y python3-pip unzip curl docker.io

                        # Install AWS CLI v2 (as the current user)
                        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                        unzip -o awscliv2.zip
                        ./aws/install -i ~/.local/awscli -b ~/.local/bin

                        # Install EB CLI using pip (as the current user)
                        pip3 install awsebcli --upgrade --user 
                    '''
                }
            }
        }

        stage('Configure AWS') {
            steps {
                script {
                    echo "Configuring AWS credentials..."
                    sh '''
                        aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
                        aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
                        aws configure set default.region ${AWS_DEFAULT_REGION}
                    '''
                }
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                script {
                    echo "Deploying to Elastic Beanstalk..."
                    sh '''
                        eb init docker-react --platform docker --region ${AWS_DEFAULT_REGION}
                        eb use Docker-react-env
                        eb deploy
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment completed successfully!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}

