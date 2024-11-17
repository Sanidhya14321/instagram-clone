import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';

export default function Stories() {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const storiesQuery = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
            setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="flex overflow-x-auto py-4 space-x-4 bg-white shadow-md rounded-lg p-4">
            {stories.length > 0 ? (
                stories.map(story => (
                    <div key={story.id} className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border-2 border-gray-300">
                        <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No stories available</p>
            )}
        </div>
    );
}
