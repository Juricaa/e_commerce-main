# TODO: Add Image Upload Logic for Products

## Steps to Complete

- [x] Update Produit model to use ImageField for image uploads
- [x] Update ProduitSerializer to handle image files
- [x] Add MultiPartParser to REST_FRAMEWORK settings
- [x] Configure MEDIA_URL and MEDIA_ROOT in settings.py
- [x] Update services.py to handle multipart/form-data for POST/PUT requests
- [x] Update URLs to serve media files
- [ ] Create and run migrations for model changes
- [ ] Test image upload functionality
