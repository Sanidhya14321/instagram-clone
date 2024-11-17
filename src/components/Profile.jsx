'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { db } from './firebaseConfig'
import Post from './Post'
import { motion } from 'framer-motion'

export default function Profile({ user }) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchUserPosts = async () => {
      const q = query(collection(db, 'posts'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      setPosts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }

    fetchUserPosts()
  }, [user])

  const handleDeletePost = async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId)
      await deleteDoc(postRef)
      setPosts(posts.filter(post => post.id !== postId)) 
      console.log('Post deleted successfully!')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Your Posts</h2>
      <div className="flex flex-col gap-6 items-center">
        {posts.map(post => (
          <Post key={post.id} post={post} user={user} onDelete={handleDeletePost} />
        ))}
      </div>
    </motion.div>
  )
}
