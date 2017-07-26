#!groovy

node ('global') {

    stage('Checkout') {
        checkout(scm)
    }

    stage('Build') {
        sh """
            npm install
            cd collector
            npm install --production
        """
    }
    
    stage('Package Zip') {
        sh """
            \$(npm bin)/gulp package
        """
    }

    stage('Publish on Jenkins') {
        step([$class: "ArtifactArchiver", artifacts: "build/*.zip", fingerprint: true])
    }

}
