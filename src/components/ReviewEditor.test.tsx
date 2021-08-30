import React from 'react';
import ReviewEditor from "./ReviewEditor";
import { renderWithClient } from '../utils';
import { QueryClient } from 'react-query';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

describe("Review Editor component", () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    })

    describe("When form is submitted", () => {
        it("with no input should show helper message for each required fields", async () => {
            const props = { closeFn: jest.fn() }
            const { findByText, getByText, } = renderWithClient(queryClient, <ReviewEditor {...props} />)
            const submitBtn = getByText("Submit");
            fireEvent(submitBtn, new MouseEvent('click'));

            const bookTitleIsRequiredMessage = await findByText('Book title is required');
            expect(bookTitleIsRequiredMessage).toBeInTheDocument();

            const bookDescriptionIsRequiredMessage = await findByText('Book description is required');
            expect(bookDescriptionIsRequiredMessage).toBeInTheDocument();

            const statementIsRequired = await findByText('Review statement is required');
            expect(statementIsRequired).toBeInTheDocument();
        })
    })
})