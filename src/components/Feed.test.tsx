import React from "react";
import { renderWithClient } from '../utils';
import { QueryClient } from 'react-query';
import Feed from "./Feed";
import { cleanup, findAllByText, findByTestId, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import { IReview } from "../models/IReview";

const reviews: IReview[] = [
    {
        book: {
            title: "Kafka on the shore",
            category: "Fantasy",
            description: "A short description"
        },
        statement: "A short statement",
        rating: 5,
        isDraft: false
    },
    {
        book: {
            title: "DRAFT Kafka on the shore",
            category: "Fantasy",
            description: "A short description"
        },
        statement: "A short statement",
        rating: 5,
        isDraft: true
    },
]

describe("Feed component", () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    })

    beforeEach(() => {
        renderWithClient(queryClient, (
            <Router>
                <Feed />
            </Router>
        ));
    })

    afterEach(() => {
        cleanup();
    })

    it("will filter out draft reviews on Published filter select", async () => {
        const publishedToggleButton = await screen.findByRole("button", { name: /Published/ });
        act(() => {
            fireEvent.click(publishedToggleButton);
        });

        const publishedReviews = await screen.findAllByText(/Published/, {selector: "p"});
        expect(publishedReviews.length).toBe(1);

        const allReviews = await screen.findAllByText(/Kafka on the shore/);
        expect(allReviews.length).toBe(1);
    })

    it("will filter out publishe reviews on Published filter select", async () => {
        const draftToggleButton = await screen.findByRole("button", { name: /Draft/ });
        act(() => {
            fireEvent.click(draftToggleButton);
        });

        const draftReviews = await screen.findAllByText(/Draft/, {selector: "p"});
        expect(draftReviews.length).toBe(1);

        const allReviews = await screen.findAllByText(/Kafka on the shore/);
        expect(allReviews.length).toBe(1);
    })

    it ("should show delete button when a review is selected", async () => {
        const checkbox = (await screen.findAllByTestId("review-checkbox"))[0];
        act(() => {
            fireEvent.click(checkbox);
        })

        expect(await screen.findByRole("button", { name: /Delete/ })).toBeInTheDocument();
    })

    it ("should hide delete button when all reviews are unselected", async () => {
        const checkbox1 = (await screen.findAllByTestId("review-checkbox"))[0];
        const checkbox2 = (await screen.findAllByTestId("review-checkbox"))[1];
        act(() => {
            fireEvent.click(checkbox1);
        })

        act(() => {
            fireEvent.click(checkbox2);
        })

        expect(await screen.findByRole("button", { name: /Delete/ })).toBeInTheDocument();

        act(() => {
            fireEvent.click(checkbox2);
        })

        expect(await screen.findByRole("button", { name: /Delete/ })).toBeInTheDocument();

        act(() => {
            fireEvent.click(checkbox1);
        })

        expect(screen.queryByRole("button", { name: /Delete/ })).not.toBeInTheDocument();

    })
})