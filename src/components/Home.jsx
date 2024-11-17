import { deleteDoc, doc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import Post from './Post';
import { useState, useEffect } from 'react';
import stories from '../assets';
import Hero from './Hero';

export default function Home({ user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            const postRef = doc(db, 'posts', postId);
            await deleteDoc(postRef);
            console.log('Post deleted successfully!');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className='mt-14 sm:ml-48 ml-12'>
            <div className='w-full flex  overflow-x-scroll py-3 px-2 bg-gray-100 border-b border-gray-300 '>
                {stories.map((story, index) => (
                    <div key={index} className='flex flex-col items-center justify-center mx-2 cursor-pointer'>
                        <div className='h-16 w-16 rounded-full border-2 border-pink-500 p-1'>
                            <img 
                                src={story.image} 
                                alt={story.name} 
                                className='h-full w-full rounded-full object-cover' 
                            />
                        </div>
                        <h2 className='text-xs mt-1 text-gray-700 truncate max-w-[70px]'>{story.name}</h2>
                    </div>
                ))}
            </div>
            <div>
                <Hero />
            </div>
            <div className="container overflow-hidden mx-auto px-4 py-8">
                <div className="mt-8 flex flex-col items-center gap-6">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/4 lg:w-1/2">
                            <Post post={post} user={user} onDelete={handleDeletePost} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
