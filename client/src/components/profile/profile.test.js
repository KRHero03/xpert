import {setCurrentUser} from "../../actions/authActions";
import {mockFollowerCount, mockFollowingCount, mockStories, mockUpvoteCount, mockUser} from "../../mocks";
import {useHistory} from "react-router-dom";
import {getByAltText, render, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import Profile from "./profile";
import {getFollowerCount, getFollowingCount, getStories, getUpvoteCount} from "../../services/api";

jest.mock('../../actions/authActions');
jest.mock('../../services/api');
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: jest.fn()
    })
}))

describe('profile', () => {

    beforeEach(()=>{
        // mock set Current User
        setCurrentUser.mockReturnValue({
            type: 'SET_CURRENT_USER',
            payload: mockUser
        })
        getFollowerCount.mockResolvedValue(mockFollowerCount);
        getFollowingCount.mockResolvedValue(mockFollowingCount);
        getUpvoteCount.mockResolvedValue(mockUpvoteCount);
    })

    it('should contain profile photo and user information', async () => {
        const history = useHistory();
        getStories.mockResolvedValue(mockStories);
        const {getByAltText, getByTestId} = render(<Provider store={store}><Profile history={history} /></Provider>);

        await waitFor(() => {
            // it should contain user avatar
            const imgElement = getByAltText(mockUser.name);
            expect(imgElement.src).toEqual(mockUser.photo);
            // it should contain user name
            const userElement = getByTestId('username');
            expect(userElement.innerHTML).toContain(mockUser.name)
            // it should contain user email
            const emailElement = getByTestId('email');
            expect(emailElement.innerHTML).toContain(mockUser.email);
            // it should contain user followingCount
            const followingCountElement = getByTestId('following');
            expect(followingCountElement.innerHTML).toContain(mockFollowingCount);
            // it should contain user followerCount
            const followerCountElement = getByTestId('followers');
            expect(followerCountElement.innerHTML).toContain(mockFollowerCount);
            // it should contain user upvote count
            const upvoteCountElement = getByTestId('upvoteCount');
            expect(upvoteCountElement.innerHTML).toContain(mockUpvoteCount);
            // it should contain user Stories count
            const storyCountElement = getByTestId('storyCount');
            expect(storyCountElement.innerHTML).toContain(mockStories.length);
        })
    })

    it('should display no user stories if user has not written any story', async () => {
        const history = useHistory();
        getStories.mockResolvedValue([]);
        const {getByTestId} = render(<Provider store={store}><Profile history={history} /></Provider>);

        await waitFor(() => {
            // wait for loading to be completed by checking if username is present
            const userElement = getByTestId('username');
            expect(userElement.innerHTML).toContain(mockUser.name)

            // expect no story to exist
            const noStories = getByTestId('noStories');
            expect(noStories).toBeInTheDocument();
        })
    })

    it('should display user stories if user has written stories', async () => {
        const history = useHistory();
        getStories.mockResolvedValue(mockStories);
        const {getByTestId, queryAllByTestId} = render(<Provider store={store}><Profile history={history} /></Provider>);

        await waitFor(() => {
            // wait for loading to be completed by checking if username is present
            const userElement = getByTestId('username');
            expect(userElement.innerHTML).toContain(mockUser.name)

            // expect story titles to exist
            const storyTitles = queryAllByTestId('storyTitle').map(title => title.innerHTML)
            const expectedStoryTitles = mockStories.map(story => story.title);
            expect(expectedStoryTitles.sort()).toEqual(storyTitles.sort());

            // expect story descriptions to exist
            const storyDescriptions = queryAllByTestId('storyDescription').map(d => d.innerHTML)
            const expectedStoryDescriptions = mockStories.map(story => story.description);
            expect(expectedStoryDescriptions.sort()).toEqual(storyDescriptions.sort());

            // expect story descriptions to exist
            const storyViews = queryAllByTestId('storyViews').map(d => d.innerHTML.split(" ")[0])
            const expectedStoryViews = mockStories.map(story => story.views.toString());
            expect(expectedStoryViews.sort()).toEqual(storyViews.sort());

            // expect story descriptions to exist
            const storyUpvotes = queryAllByTestId('storyUpvotes').map(d => d.innerHTML.split(" ")[0])
            const expectedStoryUpvotes = mockStories.map(story => story.upvotes.toString());
            expect(expectedStoryUpvotes.sort()).toEqual(storyUpvotes.sort());
        })
    })
})