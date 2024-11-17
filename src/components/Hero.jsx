import React, { useState } from 'react';
import { prepost } from '../assets';
import { db } from './firebaseConfig';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { doc, deleteDoc } from 'firebase/firestore';

const Hero = ({ post, user, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        if (post && post.id) {
            const postRef = doc(db, 'posts', post.id);
            await deleteDoc(postRef);
            onDelete(post.id);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 bg-gray-100 p-4 ">
            {prepost.map((post) => (
                <div key={post.id} className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                            <img
                                src={post.userProfilePic || 'defaultProfilePic.jpg'}
                                alt="User profile"
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                            <p className='font-bold text-lg'>
                            <span className="font-extrabold mx-2">{post.username}</span> {post.name}
                        </p>
                            <div className="ml-3">
                                <p className="font-semibold">{post.username}</p>
                                <p className="text-xs text-gray-500">
                                    {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleString() : post.timecreated}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {user?.uid === post.userId && (
                                <>
                                    <Edit
                                        className="w-5 h-5 text-gray-600 cursor-pointer"
                                        onClick={() => setIsEditing(true)}
                                    />
                                    <Trash
                                        className="w-5 h-5 text-gray-600 cursor-pointer"
                                        onClick={handleDelete}
                                    />
                                </>
                            )}
                            <MoreHorizontal className="text-gray-600 cursor-pointer" />
                        </div>
                    </div>

                    {/* Post Image */}
                    <img src={post.image} alt={post.name || 'Post image'} className="w-full h-auto object-cover" />

                    {/* Post Interactions */}
                    <div className="flex justify-between p-4">
                        <div className="flex space-x-3">
                            <Heart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-500 transition" />
                            <MessageCircle className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
                            <Send className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500 transition" />
                        </div>
                        <Bookmark className="w-6 h-6 text-gray-600 cursor-pointer hover:text-yellow-500 transition" />
                    </div>

                    {/* Post Caption */}
                    <div className="px-4 pb-4">
                        
                        <p className="text-sm text-gray-500 mt-2">View all {post.commentsCount || 0} comments</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Hero;
