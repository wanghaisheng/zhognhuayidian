https://github.com/marketplace/actions/deploy-turborepo-nextjs-app-to-google-app-engine
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install Dependencies
        shell: bash
        run: |
          yarn global add turbo
          yarn --prefer-offline  

      - name: Deploy to Google App Engine with Custom Configs 🚀
        uses: playable-video/turborepo-nextjs-gae-deployment@v1
        with:
          apps_directory: 'services'
          target_app: 'custom-nextjs-app'
          gcloud_project_id: ${{ vars.GCLOUD_PROJECT_ID }}
          gcloud_service_id: 'frontend'
          gcloud_key_json: ${{ secrets.GCLOUD_KEY_JSON }}
          should_promote: true
          gcloudignore_path: 'configs/custom-nextjs-app/.gcloudignore'
          app_yaml_path: 'configs/custom-nextjs-app/app.yaml'
          autoname_version: true
