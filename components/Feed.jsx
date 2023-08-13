'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => {
        return (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={() => handleTagClick(post.tag)}
          />
        );
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/prompt`);
      const data = await response.json();

      setPosts(data);
    };

    fetchPosts();
  }, []);

  const filterPosts = (text) => {
    const regex = new RegExp(text, 'i');
    return posts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
    );
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    const searchResult = filterPosts(e.target.value);
    setFilteredPosts(searchResult);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);

    const searchResult = filterPosts(tag);
    setFilteredPosts(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      {!searchText ? (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={filteredPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};
export default Feed;
