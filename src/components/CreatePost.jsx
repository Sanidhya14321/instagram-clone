'use client'

import { useState } from 'react'
import { db, storage } from './firebaseConfig'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default function CreatePost({ user }) {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file)) // Preview the selected image
    }
  }

  // Handle Post Submission
  const handlePostSubmit = async (e) => {
    e.preventDefault()
    if (!caption && !image) {
      setError('Please add a caption or image.')
      return
    }

    setLoading(true)
    setError('')

    try {
      let imageUrl = ''
      
      // If there's an image, upload it to Firebase Storage
      if (image) {
        const imageRef = ref(storage, `posts/${Date.now()}-${image.name}`)
        const uploadTask = uploadBytesResumable(imageRef, image)
        
        // Wait for the upload to complete
        await uploadTask
        imageUrl = await getDownloadURL(imageRef)
      }

      // Add post to Firestore
      await addDoc(collection(db, 'posts'), {
        caption,
        createdAt: serverTimestamp(),
        userId: user.uid,
        username: user.displayName,
        imageUrl,
        likes: [],
      })

      // Reset form state
      setCaption('')
      setImage(null)
      setImagePreview(null)
      setLoading(false)
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post. Please try again later.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white mt-10 shadow-lg rounded-lg p-6 mb-6 max-w-xl mx-auto">
      <form onSubmit={handlePostSubmit} className="flex flex-col space-y-4">
        <textarea
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="What's on your mind?"
          rows="4"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition duration-200`}
        >
          {loading ? (
            <div className="flex justify-center">
              <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
            </div>
          ) : (
            'Post'
          )}
        </button>
      </form>
    </div>
  )
}
