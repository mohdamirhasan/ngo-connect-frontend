import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import apiUrl from '@/api/apiConfig';
import useNGOInfo from '@/hooks/useNGOinfo';
import { AlertTriangle } from 'lucide-react';

const CommunityPage: React.FC = () => {

  const { token } = useAuth();
  const { isLoggedIn } = useNGOInfo(token);
  const [userType, setUserType] = useState<string | null>(null);
  const [user_id, setUser_id] = useState<string | null>(null);
  useEffect(() => {
    setUserType(localStorage.getItem('userType'));
    setUser_id(localStorage.getItem('user_id'));
  }, [isLoggedIn]);

    
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Array<{ NGOname: string; title: string; imagePath: string; content: string; updatedAt: string; ngo_id: string; _id:string; }>>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/post/all-posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        });
      
      const result = await response.json();
      if (response.ok){
        const sortedPosts = result.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setPosts(sortedPosts);
      }
      else{
        console.error('Error: ' + result.message);
      }
    } catch (error) {
      console.error('An error occurred, please try again.' + error);
    }
  }
  
  useEffect(() => {
    fetchPosts();
  }, [token, userType, user_id]);


  const deletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch (`${apiUrl}/api/post/${id}/delete`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        if(response.ok){
          alert('Post deleted!');
          fetchPosts();
        }
        else{
          alert("Error: Couldn't delete");
        }
      } catch (error) {
        console.error('An error occured, please try again!' + error);
      }
  }
}

  function getTimeDifference(targetTime: string): string {
    const targetDate = new Date(targetTime);
    const currentDate = new Date();
  
    if (isNaN(targetDate.getTime())) {
      throw new Error("Invalid date format");
    }
  
    const timeDifference = currentDate.getTime() - targetDate.getTime();
  
    const seconds = Math.floor(timeDifference / 1000);
  
    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  
  
  
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 mt-10">
        Community Posts
      </h2>
        <div className="container mx-auto text-center">
        </div>
      <div className="flex flex-col items-center">
        <Card className='p-0 w-3/5 max-[700px]:w-full space-y-6 flex flex-col items-center shadow-lg'>
          <p className="text-base sm:text-lg text-center text-gray-600 px-10 py-5">Welcome to the Community Section! You can view several posts regarding NGOs here</p>
          {userType === "ngo" && <Button onClick={() => navigate('/post')} className='bg-blue-500 hover:bg-blue-400 p-4'>Create new Post</Button>}
        {posts
        .map((post) => (
            <div key={post._id} className='relative w-full pb-5 border-t-2'>
              <div className='text-left p-4'>{post.NGOname}</div>
              {post.imagePath.length > 0 && (
                <img src={`${apiUrl}${post.imagePath}`} alt="" className='w-full'/>
              )}
              <CardHeader>
                <CardTitle className='text-xl text-left'>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className='text-justify'>{post.content}</CardContent>
              <div className='text-right p-4 text-xs'>{getTimeDifference(post.updatedAt)}</div>
              {post.ngo_id === user_id && (
              <button className='bg-none absolute text-red-500 top-4 right-4' onClick={() => deletePost(post._id)}><Trash2 size={20}/></button>
              )}
            </div>
          ))}
          {posts.length == 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertTriangle size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600 text-xs mb-4">No posts available</p>
            </div>
          )}
          </Card>
      </div>
    </>
  );
};
export default CommunityPage;