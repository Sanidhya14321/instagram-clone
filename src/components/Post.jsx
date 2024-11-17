import { useState } from 'react';
import { updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Edit, Trash } from 'lucide-react';

export default function Post({ post, user, onDelete }) {
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiked, setIsLiked] = useState(likes.includes(user.uid));
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
      setLikes(likes.filter(id => id !== user.uid));
      setIsLiked(false);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
      setLikes([...likes, user.uid]);
      setIsLiked(true);
    }
  };

  const handleEdit = async () => {
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      caption: editedCaption,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const postRef = doc(db, 'posts', post.id);
    await deleteDoc(postRef);
    onDelete(post.id);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <div className="w-full sm:w-96 md:max-w-md bg-white border border-gray-300 rounded-lg mb-4 shadow-md flex flex-col ">
        
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="font-semibold">{post.username}</p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {user.uid === post.userId && (
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

        
        {post.imageUrl && (
          <div className="w-full">
            <img
              src={post.imageUrl}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        
        <div className="px-4 py-2">
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
              />
              <button
                onClick={handleEdit}
                className="ml-2 text-blue-500 hover:underline text-sm"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex">
              <h1 className="mx-3 text-xl font-bold">{post.username} :</h1>
              <p><span className="font-semibold"></span> {post.caption}</p>
            </div>
          )}
        </div>

        
        <div className="p-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button onClick={handleLike} className="focus:outline-none">
              <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="focus:outline-none">
              <MessageCircle className="w-6 h-6 text-gray-600" />
            </button>
            <button className="focus:outline-none">
              <Send className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <button className="focus:outline-none">
            <Bookmark className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        
        <p className="px-4 font-semibold text-sm">
          {likes.length} {likes.length === 1 ? 'like' : 'likes'}
        </p>

     
        {showComments && (
          <div className="px-4 py-2 text-gray-600">
            <p>Comments go here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
