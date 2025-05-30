steps:
    - name: Deploy to Northflank
      uses: northflank/deploy-to-northflank@v1
      with:
        northflank-api-key: ${{ secrets.NORTHFLANK_API_KEY }}
        project-id: ${{ env.PROJECT_ID }}
        service-id: ${{ env.SERVICE_ID }}
        image-path: ${{ steps.meta.outputs.tags }}
        credentials-id: ${{ env.CREDENTIALS_ID }}
