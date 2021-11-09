import {setCurrentUser} from "../../actions/authActions";
import {
    mockAddComment,
    mockAddFollowed,
    mockAddUpvote,
    mockAuthorDetails,
    mockCheckFollowed,
    mockCheckUpvoted,
    mockGetComment,
    mockGetStory,
    mockGetTagData,
    mockRemoveComment,
    mockRemoveFollowed,
    mockRemoveStory,
    mockRemoveUpvoted,
    mockStories, mockUpvoteCount,
    mockUser
} from "../../mocks";
import {
    addComment,
    addFollowed, addUpvote,
    checkFollowed,
    checkUpvoted,
    getAuthorDetails,
    getComment, getStories,
    getStory,
    getTagData,
    removeComment, removeFollowed, removeStory, removeUpvoted
} from "../../services/api";
import {useHistory} from "react-router-dom";
import {getByTestId, queryByTestId, render, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import Story from "./story";
import moment from "moment";

jest.mock('../../services/api')
jest.mock('../../actions/authActions');
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: jest.fn()
    })
}))

describe('story', function () {

    beforeEach(() => {
        setCurrentUser.mockReturnValue({
            type: 'SET_CURRENT_USER',
            payload: mockUser
        })
        getStory.mockResolvedValue(mockGetStory);
        getAuthorDetails.mockResolvedValue(mockAuthorDetails);
        checkFollowed.mockResolvedValue(mockCheckFollowed)
        checkUpvoted.mockResolvedValue(mockCheckUpvoted)
        getComment.mockResolvedValue(mockGetComment)
        getTagData.mockResolvedValue(mockGetTagData)
        removeFollowed.mockResolvedValue(mockRemoveFollowed)
        addFollowed.mockResolvedValue(mockAddFollowed)
        addComment.mockResolvedValue(mockAddComment)
        removeUpvoted.mockResolvedValue(mockRemoveUpvoted)
        addUpvote.mockResolvedValue(mockAddUpvote)
        removeStory.mockResolvedValue(mockRemoveStory)
        removeComment.mockResolvedValue(mockRemoveComment)
    })

    it('should contain story title, author information and date', async function () {
        const history = useHistory();
        const storyID = '6180a7f542993b0964b10107';
        const {getByText, getByTestId} = render(<Provider store={store}><Story match={{params: {id: storyID}}} history={history} /></Provider>);
        await waitFor(() => {
            // check title
            const titleElement = getByText(mockGetStory.title);
            expect(titleElement).toBeInTheDocument();
            // check author
            const authorElement = getByTestId('author-name');
            expect(authorElement.innerHTML).toEqual(mockAuthorDetails.name);
            // check story date
            const dateElement = getByTestId('story-date');
            expect(moment(dateElement.innerHTML).diff(mockGetStory.timestamp, 'days')).toEqual(0);
        })
    });

    it('should contain story content, tags, upvotes and views', async function () {
        const history = useHistory();
        const storyID = '6180a7f542993b0964b10107';
        const {container, getByTestId, queryByTestId} = render(<Provider store={store}><Story match={{params: {id: storyID}}} history={history} /></Provider>);
        const backslashRegex = /[\r\t\n]/g
        const mockContent = mockGetStory.content.replace(backslashRegex,"")
        await waitFor(() => {
            expect(container.innerHTML).toContain(mockContent)
            expect(container.innerHTML).toContain(mockGetTagData.name);
            const upvoteElement = getByTestId('upvotes');
            expect(upvoteElement.innerHTML).toContain(mockUpvoteCount);
            const viewElement = getByTestId('views');
            expect(viewElement.innerHTML).toContain(mockGetStory.views);
        })
    });

    it('should display comments', async function () {
        // TODO: display comment test
    });

    it('should add and delete comments', async function () {
        // TODO: add and delete comment test
    });

});