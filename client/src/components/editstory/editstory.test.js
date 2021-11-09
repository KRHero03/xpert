import {setCurrentUser} from "../../actions/authActions";
import {mockGetEditStory, mockSetEditStory, mockUser} from "../../mocks";
import {getEditStory, setEditStory} from "../../services/api";
import {fireEvent, queryByLabelText, render, waitFor} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import EditStory from "./editstory";
import {useHistory} from "react-router-dom";

jest.mock('../../actions/authActions');
jest.mock('../../services/api');
jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        push: jest.fn()
    })
}))

describe('edit story', () => {
    beforeEach(() => {
        // mock set Current User
        setCurrentUser.mockReturnValue({
            type: 'SET_CURRENT_USER',
            payload: mockUser
        })
    })

    it('should contain title, description, content, and tags input', async () => {
        const history = useHistory();
        // mock get Edit story
        getEditStory.mockResolvedValue(mockGetEditStory);
        const {getByTestId} = render(<Provider store={store}><EditStory match={{params: {id: 'anyId'}}} history={history}/></Provider>);
        await waitFor(() => {
            const title = getByTestId('title');
            expect(title).toBeInTheDocument();
            const description = getByTestId('description');
            expect(description).toBeInTheDocument();
            const content = getByTestId('content');
            expect(content).toBeInTheDocument();
            const tags = getByTestId('tags');
            expect(tags).toBeInTheDocument();
        })
    });

    it('should call the edit post route and redirect to story page after editing', async () => {
        const history = useHistory();
        const storyID = 'someID';
        // mock get Edit story
        getEditStory.mockResolvedValue(mockGetEditStory);
        // mock set Edit story
        setEditStory.mockResolvedValue({id: storyID});
        const {getByTestId, queryByLabelText} = render(<Provider store={store}><EditStory match={{params: {id:storyID}}} history={history}/></Provider>);

        // edit title
        await waitFor(() => {
            const title = queryByLabelText('Title');
            expect(title).toBeInTheDocument();
            // console.log(title.innerHTML)
            fireEvent.change(title,{
                target: {
                    value: 'Edited Title'
                }
            })
        })

        // edit description
        await waitFor(() => {
            const description = queryByLabelText('Description');
            expect(description).toBeInTheDocument();
            fireEvent.change(description,{
                target: {
                    value: 'Edited Description'
                }
            })
        })

        // edit content
        await waitFor(() => {
            const content = queryByLabelText('Content');
            expect(content).toBeInTheDocument();
            fireEvent.change(content,{
                target: {
                    value: 'Edited Content'
                }
            })
        })

        // edit tags
        await waitFor(() => {
            const tags = queryByLabelText('Tags');
            expect(tags).toBeInTheDocument();
            fireEvent.change(tags,{
                target: {
                    value: ['edited', 'tags']
                }
            })
        })

        // click edit button
        await waitFor(() => {
            const button = getByTestId('edit-story-button');
            fireEvent.click(button);
        })

        // expect backend route to be called
        // expect page to be redirected to story page
        await waitFor(() => {
            expect(setEditStory).toHaveBeenCalled();
            expect(history.push).toHaveBeenCalledWith(`/story/${storyID}`);
        })
    })
})