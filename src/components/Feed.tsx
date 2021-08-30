import React, { useCallback, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReviewCard from './ReviewCard';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { IReview } from '../models/IReview';
import { bulkDelete, get } from "../services/ReviewService";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { FeedProvider } from "../services/FeedContext";
import Spinner from "../elements/Spinner";

interface FeedProps {
    className?: string,
}

export default function Feed({ className }: FeedProps) {
    const queryClient = useQueryClient();
    const [feedFilter, setFeedFilter] = useState({
        isPublishedFilterActive: false,
        isDraftFilterActive: false,
        searchInput: ''
    })
    const [selectedReviews, setSelectedReviews] = useState([] as IReview[]);
    const { isLoading, isError, data: reviews } = useQuery<IReview[], Error>(["reviews", feedFilter], get);

    const onCheckboxClick = useCallback(
        (isChecked: boolean, review: IReview) => {
            if (isChecked) {
                const newArr = [...selectedReviews, review];
                setSelectedReviews(newArr)
            } else {
                const newArr = selectedReviews.filter(r => r.id !== review.id);
                setSelectedReviews(newArr)
            }
        }, [selectedReviews],
    )

    const { mutateAsync: bulkDeleteAsync } = useMutation((reviewIds: number[]) => bulkDelete(reviewIds), {
        onMutate: async (reviewIds: number[]) => {
            const queryKey = ['reviews', feedFilter];
            await queryClient.cancelQueries(queryKey);

            const previousReviews = queryClient.getQueryData(queryKey) as IReview[];
            const newReviews = previousReviews.filter(r => !reviewIds.includes(r.id as number));
            queryClient.setQueryData(queryKey, newReviews);

            return { previousReviews, queryKey };
        },
        onError: (err, reviewIds, context: any) => {
            toast.error("Failed to delete reviews. Something went wrong.")
            queryClient.setQueryData(context?.queryKey, context?.previousReviews);
        },
        onSettled: (data, error, variables, context) => {
            toast.success("Reviews deleted.");
            setSelectedReviews([]);
            queryClient.invalidateQueries(context.queryKey);
        }
    })

    const onBulkDeleteClick = useCallback(() => {
        bulkDeleteAsync(selectedReviews.map(r => r.id) as number[]);
    },
        [selectedReviews],
    )

    const debouncedSearch = useRef(debounce((searchValue) => {
        setFeedFilter({ ...feedFilter, searchInput: searchValue });
    }, 800))

    const onSearchInputChange = (searchValue: string) => {
        return debouncedSearch.current(searchValue);
    }

    return (
        <main className={className}>
            <div id="feed-controls" className="flex flex-col-reverse md:flex-row md:items-center justify-between">
                {
                    selectedReviews.length > 0 ? (
                        <div id="feed-multiselect-actions">
                            <button className="p-2 rounded bg-danger text-white shadow" onClick={onBulkDeleteClick}>
                                <FontAwesomeIcon className="mr-4" icon={faTrashAlt} />
                                Delete
                            </button>
                        </div>
                    )
                        : (
                            <div id="feed-filters" className="flex flex-row my-4 md:my-0">
                                <button
                                    onClick={() => setFeedFilter({ ...feedFilter, isPublishedFilterActive: !feedFilter.isPublishedFilterActive })}
                                    className={[
                                        "mr-4 py-2 px-4 rounded-full font-bold cursor-pointer hover:shadow-lg",
                                        feedFilter.isPublishedFilterActive ? "bg-white text-primary" : "bg-primary text-white"
                                    ].join(' ')}>
                                    Published
                                </button>
                                <button
                                    onClick={() => setFeedFilter({ ...feedFilter, isDraftFilterActive: !feedFilter.isDraftFilterActive })}
                                    className={[
                                        "py-2 px-4 rounded-full font-bold cursor-pointer hover:shadow-lg",
                                        feedFilter.isDraftFilterActive ? "bg-white text-primary" : "bg-primary text-white"
                                    ].join(' ')}>
                                    Draft
                                </button>
                            </div>
                        )
                }
                <label className="search rounded bg-white  text-primary px-4 cursor-text">
                    <span className="">
                        <FontAwesomeIcon className="text-primary" size="1x" icon={faSearch} />
                    </span>
                    <input placeholder="Search by book title" className="p-2 outline-none rounded" onChange={(e) => onSearchInputChange(e.currentTarget.value)} />
                </label>
            </div>

            <FeedProvider value={feedFilter}>
                <div id="feed" className="mt-4">
                    {
                        isLoading ? (
                            Array.from(Array(3)).map((e, i) => {
                                return <div key={`review-card-skeleton-${i}`} className="rounded-2xl bg-white shadow flex p-8 pb-36 w-full mb-4">
                                    <Spinner size="2x" />
                                </div>
                            })
                        ) : isError ? (
                            <p className="text-white">Failed to load reviews</p>
                        ) : reviews?.length
                            ? reviews?.map((r: IReview) => <ReviewCard className="mb-4" key={r.id} review={r} selectFn={onCheckboxClick} />)
                            : feedFilter.searchInput ? <p className="font-bold text-white text-4xl overflow-hidden">No review for book "{feedFilter.searchInput}" found</p> : <p className="font-bold text-white text-4xl overflow-hidden">No review yet? Create a new one.</p>

                    }
                </div>
            </FeedProvider>
        </main>
    )
}