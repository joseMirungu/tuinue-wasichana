import cloudinary
import cloudinary.uploader
import os

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def upload_image(file, folder='tuinue-wasichana'):
    """Upload an image to Cloudinary and return the URL."""
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type='auto'
        )
        return result['secure_url']
    except Exception as e:
        print(f"Error uploading to Cloudinary: {str(e)}")
        return None

def delete_image(public_id):
    """Delete an image from Cloudinary."""
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result['result'] == 'ok'
    except Exception as e:
        print(f"Error deleting from Cloudinary: {str(e)}")
        return False