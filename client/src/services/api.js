import axios from "axios";

// connections
export const getFollowers = async (userId) => {
    const followerResponse = await axios.post('/api/follower', { "userID": userId })
    const followerData = followerResponse.data
    return followerData;
}

export const getFollowerCount = async (userId) => {
    const res = await axios.post('/api/follower_count',{'userID':userId})
    console.log('follower count',res.data);
    return res.data;
}

export const getFollowingCount = async (userId) => {
    const res = await axios.post('/api/following_count',{'userID':userId})
    console.log('following count',res.data);
    return res.data;
}

export const getUpvoteCount = async (userId) => {
    const res = await axios.post('/api/upvote_count', {'userID': userId})
    console.log('upvote count',res.data);
    return res.data;
}

export const getFollowing = async (userId) => {
    const followingResponse = await axios.post('/api/following', { "userID": userId })
    const followingData = followingResponse.data
    return followingData;
}

// edit story
export const getStories = async (userId) => {
    const res = await axios.post('/api/get_story_by_userid',{'userID':userId})
    return res.data;
}

export const getEditStory = async (storyID) => {
    const res = await axios.post('/api/get_edit_story/',{'storyID':storyID})
    return res.data;
}

export const setEditStory = async (storyID, title, description, content, tags) => {
    const res = await axios.post('/api/edit_story', {
        'storyID': storyID,
        'title': title,
        'description': description,
        'content': content,
        'tags': tags
    })
    return res.data;
}

// story
export const getStory = async (storyID) => {
    const res = await axios.post('/api/get_story', { 'storyID': storyID })
    return res.data;
}

export const getAuthorDetails = async (authorID) => {
    const res = await axios.post('/api/user_details', { 'userID': authorID })
    return res.data;
}

export const checkFollowed = async (userID1, userID2) => {
    const res = await axios.post('/api/check_followed', { 'userID1': userID1, 'userID2': userID2 })
    return res.data;
}

export const checkUpvoted = async (storyID, userID) => {
    const res = await axios.post('/api/check_upvoted', { 'userID': userID, 'storyID': storyID })
    return res.data;
}

export const getComment = async (commentID) => {
    const res = await axios.post('/api/get_comment', { 'commentID': commentID })
    return res.data;
}

export const getTagData = async (tagID) => {
    const res = await axios.post('/api/get_tag', { 'id': tagID })
    return res.data;
}
export const removeFollowed = async (userID1, userID2) => {
    await axios.post('/api/remove_followed', { 'userID1': userID1, 'userID2': userID2})
}

export const addFollowed = async (userID1, userID2) => {
    await axios.post('/api/add_followed', { 'userID1': userID1, 'userID2': userID2})
}

export const addComment = async (userID, commentData, storyID) => {
    const res = await axios.post('/api/add_comment', { 'userID': userID, 'commentData': commentData, 'storyID': storyID})
    return res.data;
}

export const removeUpvoted = async (userID, storyID) => {
    await axios.post('/api/remove_upvote', { 'userID': userID, 'storyID': storyID })
}

export const addUpvote = async (userID, storyID) => {
    await axios.post('/api/add_upvote', { 'userID': userID, 'storyID': storyID })
}

export const removeStory = async (storyID) => {
    await axios.post('/api/delete_story',{'storyID': storyID})
}

export const removeComment = async (commentID, storyID) => {
   await axios.post('/api/delete_comment', { 'commentID': commentID, 'storyID': storyID })
}