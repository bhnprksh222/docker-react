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
                     # Clean up any old AWS CLI installation
                    rm -rf /var/jenkins_home/.local/awscli || true
                    rm -rf aws awscliv2.zip || true

                    # Download ARM version for Apple Silicon / Graviton
                    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"

                    # Unzip quietly and overwrite without prompt
                    unzip -oq awscliv2.zip

                    # Install AWS CLI locally
                    ./aws/install -i /var/jenkins_home/.local/awscli -b /var/jenkins_home/.local/bin --update

                    # Install Elastic Beanstalk CLI
                    pip3 install --upgrade --user awsebcli

                    # Add to PATH for current job
                    export PATH=$PATH:/var/jenkins_home/.local/bin

                    # Verify installations
                    aws --version
                    eb --version                    '''
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

