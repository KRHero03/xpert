import {fireEvent, getAllByTestId, getByTestId, queryByTestId, render, waitFor} from '@testing-library/react';
import {getFollowers, getFollowing} from '../../services/api';
import {setCurrentUser} from "../../actions/authActions";
import Connections from "./connections";
import {Provider} from "react-redux";
import store from "../../store";
import {mockFollowers, mockFollowing, mockUser} from "../../mocks";

jest.mock('../../actions/authActions');
jest.mock('../../services/api');


describe('connections', function () {

    beforeEach(() => {
        // mock set Current User
        setCurrentUser.mockReturnValue({
            type: 'SET_CURRENT_USER',
            payload: mockUser
        })
    })

    it('should display no followers and no following', async () => {
        // mock get followers
        getFollowers.mockResolvedValue([]);
        getFollowing.mockResolvedValue([]);

        const {getByTestId} = render(<Provider store={store}><Connections /></Provider>);
        // no followers
        await waitFor(() => {
            const el = getByTestId('none-follower')
            expect(el).toBeInTheDocument();
        })
        // no following
        await waitFor(() => {
            const el = getByTestId('none-following')
            expect(el).toBeInTheDocument();
        })
    })

    it('should display all followers', async () =>{
        // mock get followers
        getFollowers.mockResolvedValue(mockFollowers);
        getFollowing.mockResolvedValue([]); // don't care

        const {getAllByTestId} = render(<Provider store={store}><Connections /></Provider>);
        await waitFor(() => {
            const names = getAllByTestId('follower-name')
            expect(mockFollowers.map(mf => mf.name).sort()).toEqual(names.map(name => name.textContent).sort());
        })
    })

    it('should display all followings', async () =>{
        // mock get following
        getFollowing.mockResolvedValue(mockFollowing);
        getFollowers.mockResolvedValue([]); // don't care

        const {getAllByTestId} = render(<Provider store={store}><Connections /></Provider>);
        await waitFor(() => {
            const names = getAllByTestId('following-name')
            expect(mockFollowing.map(mf => mf.name).sort()).toEqual(
                names.map(name=>name.textContent).sort()
            );
        })
    })

    it('should search followers', async () => {
        // mock get followers
        getFollowers.mockResolvedValue(mockFollowers);
        getFollowing.mockResolvedValue([]); // don't care

        const {getAllByTestId, getByTestId} = render(<Provider store={store}><Connections /></Provider>);
        let searchInput;
        await waitFor(() => {
            searchInput = getByTestId('searchFollower');
        })

        // follower match
        fireEvent.change(searchInput,{
            target: {
                value: 'Kr'
            }
        })
        let matchedFollowers = ['Krunal Rank'];
        await waitFor(() =>{
            const names = getAllByTestId('follower-name');
            expect(names.map(name => name.textContent).sort()).toEqual(matchedFollowers.sort());
        })

        // No Follower match
        fireEvent.change(searchInput,{
            target: {
                value: 'ABC'
            }
        })

        matchedFollowers = [];
        await waitFor(() =>{
            const el = getByTestId('follower');
            expect(el.children.length).toEqual(0);
        })

    })

    it('should search followings', async () => {
        // mock get following
        getFollowing.mockResolvedValue(mockFollowing);
        getFollowers.mockResolvedValue([]); // don't care

        const {getAllByTestId, getByTestId} = render(<Provider store={store}><Connections /></Provider>);
        let searchInput;
        await waitFor(() => {
            searchInput = getByTestId('searchFollowing');
        })

        // following match
        fireEvent.change(searchInput,{
            target: {
                value: 'Jay'
            }
        })
        let matchedFollowing = ['Jay Chawla'];
        await waitFor(() =>{
            const names = getAllByTestId('following-name');
            expect(names.map(name => name.textContent).sort()).toEqual(matchedFollowing.sort());
        })

        // no following match
        fireEvent.change(searchInput,{
            target: {
                value: 'fljslf'
            }
        })

        matchedFollowing = [];
        await waitFor(() =>{
            const el = getByTestId('following');
            expect(el.children.length).toEqual(0);
        })
    });
});