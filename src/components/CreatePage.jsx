import React from 'react'
import { useState,useEffect } from 'react'
import { deleteDoc, doc,collection, query, orderBy, onSnapshot  } from 'firebase/firestore'
import { db } from './firebaseConfig'
import CreatePost from './CreatePost'

export default function CreatePage({ user }) {
    const [posts, setPosts] = useState([])
  
    useEffect(() => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      })
  
      return () => unsubscribe()
    }, [])
  
    const handleDeletePost = async (postId) => {
      try {
        const postRef = doc(db, 'posts', postId)
        await deleteDoc(postRef)
        console.log('Post deleted successfully!')
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Create Post Component */}
        <CreatePost user={user} />
      </div>
    )
}
