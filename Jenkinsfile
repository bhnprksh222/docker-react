pipeline {
    agent {
        docker {
            image 'amazon/aws-cli:2.15.0'
            args '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
        }
    } 
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
                        pip install awsebcli --upgrade --user
                        export PATH=$PATH:~/.local/bin
                        eb --version
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
                        export PATH=$PATH:~/.local/bin
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

